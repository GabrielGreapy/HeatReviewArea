import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

export async function POST(req: Request) {
  let runId = "";

  try {
    // 🟢 1. Extrai o nome da cidade passado na query string (?cityName=...)
    const { searchParams } = new URL(req.url);
    const queryCityName = searchParams.get("cityName") || "";

    const body = await req.json();

    console.log("📥 Payload do Webhook do Apify recebido:", JSON.stringify(body, null, 2));

    // 🟢 Extração segura das propriedades do webhook do Apify
    const eventType = body.eventType || body.resource?.status;
    const resource = body.resource || {};
    const eventData = body.eventData || {};

    // Obtém o runId e datasetId das possíveis chaves aninhadas do Apify
    runId = resource.id || eventData.actorRunId || body.runId;
    const datasetId = resource.defaultDatasetId || eventData.defaultDatasetId || body.datasetId;

    if (!runId) {
      return NextResponse.json(
        { error: "ID da Run não foi encontrado no payload do Apify." },
        { status: 400 }
      );
    }

    // Trata execução concluída com sucesso
    if (eventType === "ACTOR.RUN.SUCCEEDED" || resource.status === "SUCCEEDED") {
      if (!datasetId) {
        throw new Error("ID do Dataset não foi informado pelo Apify.");
      }

      const apiKey = process.env.APIFY_TOKEN;

      // Busca os itens raspados no Dataset
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}`
      );

      if (!datasetResponse.ok) {
        throw new Error("Falha ao buscar os itens do Dataset no Apify.");
      }

      const places = await datasetResponse.json();

      // 🟢 2. Salva os estabelecimentos padronizados no Firestore em lotes (máximo de 400 por batch)
      if (Array.isArray(places) && places.length > 0) {
        const CHUNK_SIZE = 400;

        for (let i = 0; i < places.length; i += CHUNK_SIZE) {
          const chunk = places.slice(i, i + CHUNK_SIZE);
          const batch = db.batch();

          chunk.forEach((place: any) => {
            const docId = place.placeId || place.cid || place.id;

            if (docId) {
              const placeRef = db.collection("places").doc(docId);

              // 🟢 Normalização rigorosa das notas e avaliações
              const rawScore = place.totalScore ?? place.stars ?? place.rating ?? 0;
              const score = typeof rawScore === "number" ? rawScore : parseFloat(rawScore) || 0;
              const reviews = Number(place.reviewsCount ?? place.reviewsCountRaw ?? place.reviews ?? 0);

              batch.set(
                placeRef,
                {
                  ...place,
                  rating: score,          // Campo legível padronizado
                  totalScore: score,      // Compatibilidade nativa do Apify
                  reviewsCount: reviews,  // Total de avaliações
                  cityNameSearch: queryCityName || place.city || "",
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              );
            }
          });

          await batch.commit();
        }
      }

      // 🟢 3. Atualiza o job para COMPLETED no Firestore
      await db.collection("scraping_jobs").doc(runId).update({
        status: "COMPLETED",
        totalPlaces: Array.isArray(places) ? places.length : 0,
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Job ${runId} finalizado e atualizado para COMPLETED com ${places.length} locais!`);

      return NextResponse.json({
        success: true,
        message: "Webhook processado e dados padronizados com sucesso!",
      });
    }

    // Trata execução com falha no Apify
    if (eventType === "ACTOR.RUN.FAILED" || resource.status === "FAILED") {
      await db.collection("scraping_jobs").doc(runId).update({
        status: "FAILED",
        error: "Execução falhou no Apify",
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: false,
        message: "Job marcado como FAILED no Firestore.",
      });
    }

    return NextResponse.json({ message: "Evento ignorado." });
  } catch (error: any) {
    console.error("❌ Erro ao processar webhook do Apify:", error);

    // Garante que o status no Firestore não fique travado em PROCESSING em caso de exceção
    if (runId) {
      await db
        .collection("scraping_jobs")
        .doc(runId)
        .update({
          status: "FAILED",
          error: error.message || "Erro interno no webhook",
          updatedAt: new Date().toISOString(),
        })
        .catch(() => {});
    }

    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
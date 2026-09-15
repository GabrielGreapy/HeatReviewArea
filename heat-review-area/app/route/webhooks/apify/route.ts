import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/app/lib/firebase-client"; // ou seu firebase-admin no servidor
import { doc, updateDoc, collection, writeBatch } from "firebase/firestore";
import { Place } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Extrai dados do payload enviado pelo Apify / Webhook
    const { runId, status, items, cityName, cityNameSearch } = body;

    if (!runId) {
      return NextResponse.json(
        { error: "runId é obrigatório." },
        { status: 400 }
      );
    }

    const jobRef = doc(dbClient, "scraping_jobs", runId);

    // 2. Se o Apify falhou ou cancelou a execução
    if (status === "FAILED" || status === "ABORTED") {
      await updateDoc(jobRef, {
        status: "FAILED",
        error: body.error || "O job do Apify falhou.",
        updatedAt: new Date(),
      });

      return NextResponse.json({ message: "Job marcado como FAILED." });
    }

    // 3. Se o Job foi concluído com sucesso e temos estabelecimentos
    if (status === "SUCCEEDED" || status === "COMPLETED") {
      const placesList: Place[] = items || [];

      if (placesList.length > 0) {
        // Usamos WriteBatch do Firestore para salvar múltiplos locais de forma performática
        const batch = writeBatch(dbClient);
        const searchesRef = collection(dbClient, "searches");

        placesList.forEach((place) => {
          // Garante a presença das coordenadas antes de salvar
          if (place.location?.lat && place.location?.lng) {
            const newDocRef = doc(searchesRef);

            batch.set(newDocRef, {
              title: place.title || place.name || "Sem nome",
              rating: place.rating || null,
              reviewsCount: place.reviewsCount || 0,
              address: place.address || place.street || "",
              street: place.street || "",
              neighborhood: place.neighborhood || "",
              city: cityName || "",
              cityNameSearch: (cityNameSearch || cityName || "").trim().toLowerCase(),
              location: {
                lat: place.location.lat,
                lng: place.location.lng,
              },
              placeId: place.placeId || "",
              url: place.url || "",
              runId: runId,
              createdAt: new Date(),
            });
          }
        });

        // Executa a gravação em lote no banco
        await batch.commit();
      }

      // 4. Atualiza o status do Job para COMPLETED
      // O seu listener `listenToScrapeJob` no frontend ouvirá essa alteração instantaneamente!
      await updateDoc(jobRef, {
        status: "COMPLETED",
        totalItemsSaved: placesList.length,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        message: "Dados salvos e job finalizado com sucesso!",
        totalSaved: placesList.length,
      });
    }

    return NextResponse.json({ message: "Evento ignorado / Status pendente." });
  } catch (error: any) {
    console.error("❌ Erro ao processar webhook do Apify:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor", details: error.message },
      { status: 500 }
    );
  }
}
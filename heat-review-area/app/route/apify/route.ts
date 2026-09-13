import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.APIFY_TOKEN;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave do Apify não está configurada no .env.local" },
        { status: 500 }
      );
    }

    if (!body.searchString) {
      return NextResponse.json(
        { error: "O campo 'searchString' é obrigatório." },
        { status: 400 }
      );
    }

    // 1. Declaração dos IDs e URLs na ordem correta
    const actorID = "nwua9Gu5YrADL7ZDj";
    const webHookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/apify`;

    // 2. Estruturação limpa do Webhook do Apify
    const webhooksConfig = [
      {
        eventTypes: ["ACTOR.RUN.SUCCEEDED"],
        requestUrl: webHookUrl,
      },
    ];

    const apifyURL = `https://api.apify.com/v2/actors/${actorID}/runs?token=${apiKey}&webhooks=${encodeURIComponent(
      JSON.stringify(webhooksConfig)
    )}`;

    // 3. Payload enxuto focado em economia e privacidade
    const inputPayload = {
      searchStringsArray: [body.searchString],
      locationQuery: body.locationQuery || "",
      language: "pt-BR",
      maxCrawledPlacesPerSearch: Number(body.maxPlaces) || 50,
      maxReviews: Number(body.maxReviews) || 100,
      reviewsSort: "newest",
      oneReviewPerRow: false,
      scrapeImages: false,
      maxImages: 0,
      scrapeReviewerName: false,
      scrapeReviewerId: false,
      scrapeReviewerUrl: false,
      scrapeResponseFromOwner: false,
      scrapeQuestions: false,
      scrapePeopleAlsoSearch: false,
      scrapeWebResults: false,
      additionalInfo: false,
    };

    console.log("Iniciando raspagem no Apify:", inputPayload);

    // 4. Disparo único para a API do Apify
    const response = await fetch(apifyURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pelo Apify:", data);
      return NextResponse.json(
        { error: "Erro ao iniciar raspagem no Apify", details: data },
        { status: response.status }
      );
    }

    const runId = data.data.id;
    const datasetId = data.data.defaultDatasetId;

    // 5. Registra o job no Firestore com o status inicial
    await db.collection("scraping_jobs").doc(runId).set({
      searchString: body.searchString,
      locationQuery: body.locationQuery || "",
      datasetId: datasetId,
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      runId,
      datasetId,
      message: "Scraping iniciado com sucesso e registrado no Firestore!",
    });
  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
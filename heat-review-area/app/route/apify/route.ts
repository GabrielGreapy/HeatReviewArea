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

    const actorID = "nwua9Gu5YrADL7ZDj";
    const rawSearch = body.searchString;
    const cleanLocation = rawSearch.split("-")[0].replace(", Brazil", "").trim();

    const searchTerms = [
      `estabelecimentos em ${cleanLocation}`,
      `restaurantes em ${cleanLocation}`,
      `comércio em ${cleanLocation}`,
    ];

    // 🟢 1. Obtém a URL do localtunnel definida no .env.local
    const baseUrl = process.env.WEBHOOK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 🟢 2. Ajustado para a pasta /route/ (Opção 2)
    const webhookTargetUrl = `${baseUrl}/route/apify-webhook?cityName=${encodeURIComponent(cleanLocation)}`;

    const inputPayload = {
      searchStringsArray: searchTerms,
      locationQuery: cleanLocation,
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

    // 🟢 3. Converte a configuração do Webhook em JSON -> Base64 para a API do Apify
    const webhooksConfig = [
      {
        eventTypes: ["ACTOR.RUN.SUCCEEDED", "ACTOR.RUN.FAILED"],
        requestUrl: webhookTargetUrl,
      },
    ];
    const base64Webhooks = Buffer.from(JSON.stringify(webhooksConfig)).toString("base64");

    console.log("Iniciando raspagem de estabelecimentos no Apify...", inputPayload);

    // Passa o base64Webhooks na query string da URL do Apify
    const apifyURL = `https://api.apify.com/v2/actors/${actorID}/runs?token=${apiKey}&waitForFinish=0&webhooks=${encodeURIComponent(base64Webhooks)}`;

    const response = await fetch(apifyURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputPayload), // Envia apenas os parâmetros do Actor
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pelo Apify:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Erro ao iniciar raspagem no Apify",
          details: data,
        },
        { status: response.status }
      );
    }

    const runId = data.data.id;
    const datasetId = data.data.defaultDatasetId;

    await db.collection("scraping_jobs").doc(runId).set({
      searchString: body.searchString,
      locationQuery: cleanLocation,
      datasetId: datasetId,
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      runId,
      datasetId,
      message: "Job de scraping iniciado com sucesso em segundo plano!",
    });
  } catch (error: any) {
    console.error("Erro interno na rota do Apify:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
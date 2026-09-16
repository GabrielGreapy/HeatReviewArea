import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchBoundaryGeoJSON(queryName: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      queryName
    )}&polygon_geojson=1&format=json`;

    const res = await fetch(url, {
      headers: { "User-Agent": "HeatReviewArea/1.0 (contato@seudominio.com)" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.length > 0 && data[0].geojson) {
      return {
        type: data[0].geojson.type,
        coordinates: data[0].geojson.coordinates,
        boundingbox: data[0].boundingbox,
      };
    }
  } catch (error) {
    console.error(`Erro ao buscar fronteira de ${queryName}:`, error);
  }
  return null;
}

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

    // Trata a string para remover CEP e País, mantendo apenas "Cidade, Estado"
    const rawSearch = body.searchString;
    const cleanLocation = rawSearch.split("-")[0].replace(", Brazil", "").trim();

    // Monta os termos de busca reais que obrigam o Apify a raspar negócios/locais
    const searchTerms = [
      `estabelecimentos em ${cleanLocation}`,
      `restaurantes em ${cleanLocation}`,
      `comércio em ${cleanLocation}`
    ];

    const apifyURL = `https://api.apify.com/v2/actors/${actorID}/runs?token=${apiKey}&waitForFinish=120`;

    // 1. O payload correto enviado para a API do Apify
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

    console.log("Iniciando raspagem de estabelecimentos no Apify...", inputPayload);

    const response = await fetch(apifyURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputPayload),
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

    // Registra o status inicial no Firestore
    await db.collection("scraping_jobs").doc(runId).set({
      searchString: body.searchString,
      locationQuery: cleanLocation,
      datasetId: datasetId,
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
    });

    // 2. Baixa o dataset retornado pelo Apify
    const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}&clean=true`;
    const datasetRes = await fetch(datasetUrl);
    const places = await datasetRes.json();

    if (!Array.isArray(places)) {
      throw new Error("Formato de dataset retornado pelo Apify é inválido.");
    }

    // 3. Processamento e gravação no Firestore
    const neighborhoodsSet = new Set<string>();
    const streetsSet = new Set<string>();
    let cityName = "";

    let batch = db.batch();
    let operationCount = 0;

    const commitBatchIfNeeded = async () => {
      if (operationCount >= 450) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    };

    for (const place of places) {
      // Descarta o registro se for apenas a indicação geográfica da própria cidade (sem avaliações)
      if (!place.title || place.title.toLowerCase() === cleanLocation.split(",")[0].toLowerCase()) {
        continue;
      }

      const lat = place.location?.lat || 0;
      const lng = place.location?.lng || 0;

      if (place.neighborhood) neighborhoodsSet.add(place.neighborhood);
      if (place.street) streetsSet.add(place.street);
      if (place.city && !cityName) cityName = place.city;

      const placeId = place.id || `${lat}_${lng}`.replace(/\./g, "_");
      const placeRef = db.collection("places").doc(placeId);

      batch.set(
        placeRef,
        {
          title: place.title || "",
          address: place.address || "",
          street: place.street || "",
          neighborhood: place.neighborhood || "",
          city: place.city || "",
          location: { lat, lng },
          totalReviews: place.reviewsCount || place.reviews?.length || 0,
          rating: place.totalScore || 0,
          reviews: place.reviews || [],
          updatedAt: new Date().toISOString(),
          lastRunId: runId,
        },
        { merge: true }
      );

      operationCount++;
      await commitBatchIfNeeded();
    }

    // Busca fronteiras geográficas dos bairros
    const neighborhoods = Array.from(neighborhoodsSet);
    for (const neighborhood of neighborhoods) {
      const searchQuery = cityName
        ? `${neighborhood}, ${cityName}`
        : neighborhood;

      const boundaryData = await fetchBoundaryGeoJSON(searchQuery);

      if (boundaryData) {
        const boundaryId = `${neighborhood}_${cityName || "default"}`
          .toLowerCase()
          .replace(/\s+/g, "_");

        const boundaryRef = db.collection("boundaries").doc(boundaryId);

        batch.set(
          boundaryRef,
          {
            name: neighborhood,
            city: cityName,
            type: "NEIGHBORHOOD",
           
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        operationCount++;
        await commitBatchIfNeeded();
      }

      await delay(1000);
    }

    // Salva metadados dos filtros
    const filterRef = db.collection("filter_metadata").doc(runId);
    batch.set(filterRef, {
      city: cityName || cleanLocation,
      neighborhoods: Array.from(neighborhoodsSet),
      streets: Array.from(streetsSet),
      totalPlaces: places.length,
      createdAt: new Date().toISOString(),
    });
    operationCount++;

    // Atualiza status final do Job para COMPLETED
    const jobRef = db.collection("scraping_jobs").doc(runId);
    batch.update(jobRef, {
      status: "COMPLETED",
      placesCount: places.length,
      updatedAt: new Date().toISOString(),
    });
    operationCount++;

    await batch.commit();

    return NextResponse.json({
      success: true,
      runId,
      datasetId,
      message: "Scraping e processamento concluídos com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro interno na rota do Apify:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
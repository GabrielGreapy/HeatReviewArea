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
    const { eventData } = body;

    if (!eventData || !eventData.actorRunId || !eventData.defaultDatasetId) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const runId = eventData.actorRunId;
    const datasetId = eventData.defaultDatasetId;
    const apiKey = process.env.APIFY_TOKEN;

    const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}&clean=true`;
    const datasetRes = await fetch(datasetUrl);
    const places = await datasetRes.json();

    if (!Array.isArray(places)) {
      return NextResponse.json({ error: "Dataset inválido" }, { status: 400 });
    }

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

    // 1. Processa e enfileira os locais
    for (const place of places) {
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

    // 2. Busca fronteiras dos bairros com controle de taxa (1s por req)
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
            geojson: boundaryData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        operationCount++;
        await commitBatchIfNeeded();
      }

      await delay(1000);
    }

    // 3. Salva os metadados dos filtros
    const filterRef = db.collection("filter_metadata").doc(runId);
    batch.set(filterRef, {
      city: cityName,
      neighborhoods: Array.from(neighborhoodsSet),
      streets: Array.from(streetsSet),
      totalPlaces: places.length,
      createdAt: new Date().toISOString(),
    });
    operationCount++;

    // 4. Atualiza o status do Job para COMPLETED
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
      message: "Scraping, fronteiras geográficas e filtros salvos no Firestore com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro no processamento do Webhook Apify:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no Webhook" },
      { status: 500 }
    );
  }
}
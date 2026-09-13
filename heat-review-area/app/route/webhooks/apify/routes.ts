import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

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
      return NextResponse.json({ error: "Formato de dataset inválido" }, { status: 400 });
    }

    const batch = db.batch();
    const jobRef = db.collection("scraping_jobs").doc(runId);

    
    places.forEach((place: any) => {
      const lat = place.location?.lat || 0;
      const lng = place.location?.lng || 0;

      const placeId = place.id || `${lat}_${lng}`.replace(/\./g, "_");
      const placeRef = db.collection("places").doc(placeId);

      batch.set(
        placeRef,
        {
          title: place.title || "",
          address: place.address || "",
          location: { lat, lng },
          totalReviews: place.reviewsCount || place.reviews?.length || 0,
          rating: place.totalScore || 0,
          reviews: place.reviews || [], 
          updatedAt: new Date().toISOString(),
          lastRunId: runId,
        },
        { merge: true }
      );
    });

    batch.update(jobRef, {
      status: "COMPLETED",
      placesCount: places.length,
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Dados processados e salvos no Firestore.",
    });
  } catch (error) {
    console.error("Erro no processamento do Webhook Apify:", error);
    return NextResponse.json(
      { error: "Erro interno no Webhook" },
      { status: 500 }
    );
  }
}
import { onSnapshot, doc } from "@firebase/firestore";
import { dbClient } from "../lib/firebase-client";

interface ScrapeParams {
  cityName: string;
  maxPlaces?: number;
  maxReviews?: number;
}

export async function startScrapeJob({
  cityName,
  maxPlaces = 50,
  maxReviews = 100,
}: ScrapeParams) {
  const response = await fetch("/route/apify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchString: cityName,
      locationQuery: cityName,
      maxPlaces,
      maxReviews,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro retornado da API /route/apify:", data);
    throw new Error(
      data.details?.error?.message ||
        data.error ||
        "Falha ao iniciar scraping"
    );
  }

  return data;
}

export function listenToScrapeJob(
  runId: string,
  onComplete: () => void,
  onError: (error: any) => void
) {
  const jobRef = doc(dbClient, "scraping_jobs", runId);

  const unsubscribe = onSnapshot(
    jobRef,
    (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();

      if (data.status === "COMPLETED") {
        onComplete();
        unsubscribe();
      } else if (data.status === "FAILED") {
        onError(data.error || "Falha no scraping");
        unsubscribe();
      }
    },
    (error) => {
      onError(error);
      unsubscribe();
    }
  );

  return unsubscribe;
}
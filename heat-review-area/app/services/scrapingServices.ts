import { onSnapshot, doc } from "firebase/firestore";
import { dbClient } from "../lib/firebase-client";
import { ScrapeParams } from "../types";

export async function startScrapeJob({
  cityName,
  maxPlaces = 50,
  maxReviews = 100,
}: ScrapeParams) {
  const normalizedCity = cityName.trim().toLowerCase();

 
  const response = await fetch("/route/apify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchString: cityName,
      locationQuery: cityName,
      cityNameSearch: normalizedCity,
      maxPlaces,
      maxReviews,
    }),
  });

  const contentType = response.headers.get("content-type");
  if( !contentType || !contentType.includes("application/json")){
    const text = await response.text();
    console.error("Servidor retornou algo que não é json... ops: " ,text)
    throw new Error("A rota API retornou um HTML em vez de Json. verifique o caminho da url")
  }

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
        console.log("🎉 Processamento concluído com sucesso!");
        
        setTimeout(() => unsubscribe(), 0);
        onComplete();
      } else if (data.status === "FAILED") {
        console.error("❌ Processamento falhou:", data.error);
        setTimeout(() => unsubscribe(), 0);
        onError(data.error || "Falha no scraping");
      }
    },
    (error) => {
      console.error("❌ Erro no snapshot do Firestore:", error);
      onError(error);
    }
  );

  return unsubscribe;
}
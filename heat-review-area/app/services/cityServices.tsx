import { dbClient } from "../lib/firebase-client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Place } from "../types";

export async function fetchCityHistory(cityName: string): Promise<Place[]> {
  if (!cityName) return [];

  try {
    
    const cleanCity = cityName.split(",")[0].trim();
    
    console.log("🔎 Buscando estabelecimentos na coleção 'places' para:", cleanCity);

    const placesRef = collection(dbClient, "places");
    
    
    const q = query(placesRef, where("city", "==", cleanCity));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("ℹ️ Nenhum local encontrado para a cidade:", cleanCity);
      return [];
    }

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Place[];

    console.log("✅ Locais encontrados no banco:", results.length);
    return results;
  } catch (error) {
    console.error("❌ Erro ao buscar locais no Firestore:", error);
    throw error;
  }
}
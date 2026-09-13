import { dbClient } from "../lib/firebase-client";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function fetchCityHistory(cityName: string) {
  if (!cityName) return [];

  try {
    console.log("🔎 Buscando histórico no Firestore para:", cityName);

    const searchesRef = collection(dbClient, "searches"); // Nome da sua coleção no Firestore
    const q = query(searchesRef, where("cityName", "==", cityName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("ℹ️ Nenhum registro passado encontrado.");
      return [];
    }

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Dados encontrados:", results);
    return results;
  } catch (error) {
    console.error("❌ Erro ao buscar histórico no Firestore:", error);
    throw error;
  }
}
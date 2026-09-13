import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_projectId,
        clientEmail: process.env.FIREBASE_client_Email,
        privateKey: process.env.FIREBASE_private_key?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Erro ao inicializar o Firebase... erro:", error);
  }
}

export const db = getFirestore();
"use client";

import { useState } from "react";
import { useInputSearch } from "@/app/context/InputSearchContext";
import { fetchCityHistory } from "@/app/services/cityServices";
import { listenToScrapeJob, startScrapeJob } from "@/app/services/scrapingServices";
import { Place } from "@/app/types";

interface RetryScrapeProps {
  setCityHistory: (history: Place[]) => void;
}

export default function RetryScrape({ setCityHistory }: RetryScrapeProps) {
  const { location } = useInputSearch();
  const [isScraping, setIsScraping] = useState<boolean>(false);

  const handleStartScrapeAgain = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o reload do formulário
    if (!location?.address || isScraping) return;

    setIsScraping(true);

    try {
      const data = await startScrapeJob({ cityName: location.address });

      listenToScrapeJob(
        data.runId,
        async () => {
          const updatedHistory = await fetchCityHistory(location.address);
          setCityHistory(updatedHistory);
          setIsScraping(false);
        },
        (error) => {
          console.error("Erro no novo scraping...", error);
          setIsScraping(false);
        }
      );
    } catch (error) {
      console.error("Erro ao disparar o novo scraping do local", error);
      setIsScraping(false);
    }
  };

  if (!location?.address) return null;

  return (
    <section className="w-full max-w-lg mx-auto mt-6 rounded-2xl border border-slate-100/80 bg-white px-8 py-6 text-center shadow-[0_20px_40px_-12px_rgba(15,23,42,0.08)] sm:px-10">
      <h2 className="mb-1 text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
        Analisar reviews da cidade novamente?
      </h2>
      <p className="mx-auto mb-5 max-w-sm text-xs leading-relaxed text-slate-500">
        Recalcula as notas e áreas térmicas com as avaliações mais recentes do Google Maps.
      </p>

      <form onSubmit={handleStartScrapeAgain}>
        <button
          className="w-full rounded-xl bg-[#d97706] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b45309] hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          type="submit"
          disabled={isScraping}
        >
          {isScraping ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              Reanalisando cidade...
            </>
          ) : (
            "Analisar reviews da cidade novamente"
          )}
        </button>
      </form>
    </section>
  );
}
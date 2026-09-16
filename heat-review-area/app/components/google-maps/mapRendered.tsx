"use client";

import { useEffect, useRef, useState } from "react";
import { useMapLocation } from "@/app/context/MapLocationContext";
import { useInputSearch } from "@/app/context/InputSearchContext";
import { fetchCityHistory } from "@/app/services/cityServices";
import { listenToScrapeJob, startScrapeJob } from "@/app/services/scrapingServices";
import { drawPlaceRectangles } from "@/app/utils/mapDrawings";
import { Place } from "@/app/types";

declare global {
  interface Window {
    google: any;
  }
}

export default function Map() {
  const setMapLocation = useMapLocation();
  const { location } = useInputSearch();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const rectanglesRef = useRef<any[]>([]);

  const [cityHistory, setCityHistory] = useState<Place[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [showScrapePrompt, setShowScrapePrompt] = useState<boolean>(false);

  // 1. Inicializa o Mapa
  useEffect(() => {
    if (!location || !mapRef.current || !window.google) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 14,
    });
  }, [location]);

  // 2. Consulta o Firestore ao mudar de cidade
  useEffect(() => {
    const cityName = location?.address;
    if (!cityName) return;

    setShowScrapePrompt(false);
    setCityHistory([]);

    const checkAndLoadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const historyData = await fetchCityHistory(cityName);
        if (historyData?.length > 0) {
          setCityHistory(historyData);
        } else {
          setShowScrapePrompt(true);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    checkAndLoadHistory();
  }, [location]);

  // 3. Desenha os Quadrados
  useEffect(() => {
    rectanglesRef.current = drawPlaceRectangles(
      mapInstanceRef.current,
      cityHistory,
      rectanglesRef.current
    );
  }, [cityHistory]);

  // 4. Função para Disparar/Refazer Scraping
  const handleStartScrape = async () => {
    if (!location?.address || isScraping) return;

    setIsScraping(true);
    setShowScrapePrompt(false);

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
          console.error("❌ Erro na raspagem:", error);
          setIsScraping(false);
        }
      );
    } catch (error) {
      console.error("❌ Erro ao disparar scraping:", error);
      setIsScraping(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Container do Mapa */}
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-md bg-slate-100 select-none border border-slate-200">
        <div className="absolute inset-0 w-full h-full" ref={mapRef} />

        {/* Loading Overlay */}
        {(isLoadingHistory || isScraping) && (
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200">
              <span className="material-symbols-outlined animate-spin text-amber-600 text-[20px]">
                progress_activity
              </span>
              <span className="text-xs font-medium text-slate-800">
                {isScraping
                  ? "Buscando estabelecimentos no Google Maps..."
                  : "Buscando histórico do banco..."}
              </span>
            </div>
          </div>
        )}

        {/* Modal quando NÃO EXISTEM dados prévios */}
        {showScrapePrompt && !isLoadingHistory && !isScraping && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex items-center justify-center p-4">
            <main className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
                Deseja buscar os locais desta cidade?
              </h2>
              <p className="text-sm text-slate-500 text-center mb-6">
                Ainda não temos dados salvos para este local.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowScrapePrompt(false)}
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={handleStartScrape}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Sim
                </button>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Botão de Reanalisar (Retry) - Só aparece QUANDO JÁ EXISTEM dados renderizados */}
      {cityHistory.length > 0 && !isLoadingHistory && (
        <div className="mt-4 w-full max-w-md bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center text-center">
          <p className="text-xs text-slate-500 mb-3">
            Deseja atualizar o mapa com as avaliações mais recentes?
          </p>
          <button
            type="button"
            onClick={handleStartScrape}
            disabled={isScraping}
            className="w-full rounded-lg bg-[#d97706] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#b45309] active:scale-[0.98] disabled:opacity-50"
          >
            Analisar reviews da cidade novamente
          </button>
        </div>
      )}
    </div>
  );
}
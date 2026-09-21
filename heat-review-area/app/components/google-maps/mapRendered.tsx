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
  const unsubscribeScrapeRef = useRef<(() => void) | null>(null);

  const [cityHistory, setCityHistory] = useState<Place[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [showScrapePrompt, setShowScrapePrompt] = useState<boolean>(false);

  // Limpa o listener se o componente for desmontado
  useEffect(() => {
    return () => {
      if (unsubscribeScrapeRef.current) {
        unsubscribeScrapeRef.current();
      }
    };
  }, []);

  // 1. Inicializa / Atualiza o Mapa
  useEffect(() => {
    if (!location || !mapRef.current || !window.google) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: location.lat, lng: location.lng },
        zoom: 14,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });
    } else {
      mapInstanceRef.current.panTo({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  // 2. Busca histórico da cidade selecionada
  useEffect(() => {
    const cityName = location?.address;
    if (!cityName) return;

    setShowScrapePrompt(false);
    setCityHistory([]);

    const checkAndLoadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const historyData = await fetchCityHistory(cityName);
        if (historyData && historyData.length > 0) {
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

  // 3. Desenha os retângulos no mapa
  useEffect(() => {
    if (mapInstanceRef.current) {
      rectanglesRef.current = drawPlaceRectangles(
        mapInstanceRef.current,
        cityHistory,
        rectanglesRef.current
      );
    }
  }, [cityHistory]);

  const handleStartScrape = async () => {
    if (!location?.address || isScraping) return;

    setIsScraping(true);
    setShowScrapePrompt(false);

    try {
      const data = await startScrapeJob({ cityName: location.address });
      const runId = data.runId;

      // Cancela listener anterior se houver
      if (unsubscribeScrapeRef.current) {
        unsubscribeScrapeRef.current();
      }

      // Inicia novo listener e armazena na Ref
      unsubscribeScrapeRef.current = listenToScrapeJob(
        runId,
        async () => {
          console.log("🎉 Raspagem concluída! Atualizando mapa...");
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
    <div className="relative w-full flex flex-col items-center gap-4">
      {/* Container Principal do Mapa */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="absolute inset-0 w-full h-full z-0" ref={mapRef} />

        {/* Indicador de Status Topo Direito */}
        {cityHistory.length > 0 && !isLoadingHistory && !isScraping && (
          <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{cityHistory.length} áreas mapeadas</span>
          </div>
        )}

        {/* Loading Overlay */}
        {(isLoadingHistory || isScraping) && (
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-xs z-20 flex items-center justify-center p-4">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700">
              <span className="material-symbols-outlined animate-spin text-amber-500 text-[22px]">
                progress_activity
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isScraping
                  ? "Buscando estabelecimentos no Google Maps..."
                  : "Buscando histórico arquivado..."}
              </span>
            </div>
          </div>
        )}

        {/* Modal quando NÃO EXISTEM dados prévios */}
        {showScrapePrompt && !isLoadingHistory && !isScraping && (
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs z-30 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xl p-6 text-center animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200/50 dark:border-amber-500/20">
                <span className="material-symbols-outlined text-[24px]">
                  map_search
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Analisar esta região?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Ainda não temos dados processados para{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  {location?.address}
                </strong>
                . Deseja iniciar a varredura?
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowScrapePrompt(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleStartScrape}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Iniciar Análise
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Inferior de Reanalisar */}
      {cityHistory.length > 0 && !isLoadingHistory && (
        <div className="w-full bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hidden sm:flex shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                update
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Atualizar dados da região
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Execute uma nova raspagem para capturar as avaliações mais recentes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartScrape}
            disabled={isScraping}
            className="w-full sm:w-auto shrink-0 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-semibold transition-all disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              sync
            </span>
            <span>Reanalisar Cidade</span>
          </button>
        </div>
      )}
    </div>
  );
}
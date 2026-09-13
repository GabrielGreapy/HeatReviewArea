"use client";

import { useEffect, useRef, useState } from "react";
import { useMapLocation } from "@/app/context/MapLocationContext";
import { useInputSearch } from "@/app/context/InputSearchContext";
import { fetchCityHistory } from "@/app/services/cityServices";

declare global {
  interface Window {
    google: any;
  }
}

export default function Map() {
  const setMapLocation = useMapLocation();
  const { location } = useInputSearch();
  const mapRef = useRef<HTMLDivElement>(null);

  // Estados locais para controlar os dados do Firestore, carregamento e a modal
  const [cityHistory, setCityHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [showScrapePrompt, setShowScrapePrompt] = useState<boolean>(false);

  // Efeito 1: Renderiza / Inicializa o Google Maps
  useEffect(() => {
    console.log("🔍 Verificando valores de localização:", { location });
    if (!location) return;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const begPosition = {
        lat: location.lat,
        lng: location.lng,
      };

      new window.google.maps.Map(mapRef.current, {
        center: begPosition,
        zoom: 8,
        restriction: location.bounds
          ? {
              latLngBounds: location.bounds,
              strictBounds: false,
            }
          : undefined,
      });

      console.log("Criado o elemento map");
    };

    if (window.google) {
      initMap();
    }
  }, [location]);

  // Efeito 2: Consulta Firestore e decide se carrega ou abre o pop-up
  useEffect(() => {
    const cityName = location?.address;
    if (!cityName) return;

    // Reseta os estados ao alterar de localização
    setShowScrapePrompt(false);
    setCityHistory([]);

    const checkAndLoadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const historyData = await fetchCityHistory(cityName);

        if (historyData && historyData.length > 0) {
          console.log("✅ Pesquisa passada encontrada! Carregando dados:", historyData);
          setCityHistory(historyData);
          setShowScrapePrompt(false);
        } else {
          console.log("ℹ️ Nenhum histórico encontrado para esta cidade.");
          setCityHistory([]);
          setShowScrapePrompt(true); // Exibe o pop-up sugerindo nova pesquisa
        }
      } catch (error) {
        console.error("Erro ao verificar histórico no Firestore:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    checkAndLoadHistory();
  }, [location]);

  // Disparado ao clicar em "Sim" no pop-up
  const handleStartNewScrape = () => {
    console.log("🚀 Disparando novo scraping/pesquisa para:", location?.address);
    setShowScrapePrompt(false);
    // Próximo passo: chamar sua rota/webhook de scraping (ex: Apify)
  };

  return (
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-md bg-slate-100 select-none">
      {/* Container do Google Maps */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center" ref={mapRef} />

      {/* Indicador de carregamento enquanto consulta o Firestore */}
      {isLoadingHistory && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200">
            <span className="material-symbols-outlined animate-spin text-amber-600 text-[20px]">
              progress_activity
            </span>
            <span className="text-xs font-medium text-slate-800">
              Buscando histórico da cidade...
            </span>
          </div>
        </div>
      )}

      {/* Pop-up Modal TermoTurismo */}
      {showScrapePrompt && !isLoadingHistory && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex items-center justify-center p-4">
          <main className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-2">
              Deseja atualizar o histórico da cidade?
            </h2>

            <p className="text-sm text-slate-500 text-center mb-8">
              Recalcula os quadrantes com as novas avaliações recentes.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowScrapePrompt(false)}
                className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 active:bg-slate-100 transition-colors text-center cursor-pointer"
              >
                Não
              </button>

              <button
                type="button"
                onClick={handleStartNewScrape}
                className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-semibold text-base hover:bg-amber-700 active:bg-amber-800 transition-colors text-center shadow-sm cursor-pointer"
              >
                Sim
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
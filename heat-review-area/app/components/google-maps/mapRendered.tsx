"use client";

import { useEffect, useRef, useState } from "react";
import { useMapLocation } from "@/app/context/MapLocationContext";
import { useInputSearch } from "@/app/context/InputSearchContext";
import { fetchCityHistory } from "@/app/services/cityServices";
import { listenToScrapeJob, startScrapeJob } from "@/app/services/scrapingServices";
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

  // Array para armazenar as referências de todos os retângulos gerados
  const mapInstanceRef = useRef<any>(null);
  const rectanglesRef = useRef<any[]>([]);

  const [cityHistory, setCityHistory] = useState<Place[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [showScrapePrompt, setShowScrapePrompt] = useState<boolean>(false);

  // 1. Inicializa o Mapa sem restrições rígidas
  useEffect(() => {
    if (!location || !mapRef.current || !window.google) return;

    const begPosition = {
      lat: location.lat,
      lng: location.lng,
    };

    const map = new window.google.maps.Map(mapRef.current, {
      center: begPosition,
      zoom: 14,
    });

    mapInstanceRef.current = map;
  }, [location]);

  // 2. Consulta o Firestore ao buscar uma cidade
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
          setShowScrapePrompt(false);
        } else {
          setCityHistory([]);
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

  // 3. Desenha Quadrados Individuais para CADA Estabelecimento
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !cityHistory.length) return;

    // A) Limpa retângulos anteriores do mapa
    rectanglesRef.current.forEach((rect) => rect.setMap(null));
    rectanglesRef.current = [];

    // B) Filtra estabelecimentos com coordenadas válidas
    const validPlaces = cityHistory.filter(
      (item) => item.location?.lat && item.location?.lng
    );

    if (validPlaces.length === 0) return;

    // Tamanho do quadrado ao redor do ponto (~150 a 200 metros)
    const OFFSET = 0.0012;

    const bounds = new window.google.maps.LatLngBounds();

    // C) Desenha um quadrado individual para cada local
    validPlaces.forEach((item) => {
      const { lat, lng } = item.location;
      const rating = item.rating || 0;

      // Define a cor conforme a nota individual do lugar
      let fillColor = "#ef4444"; // Vermelho (< 4.0)
      let strokeColor = "#dc2626";

      if (rating >= 4.5) {
        fillColor = "#22c55e"; // Verde (>= 4.5)
        strokeColor = "#16a34a";
      } else if (rating >= 4.0) {
        fillColor = "#eab308"; // Amarelo (4.0 a 4.4)
        strokeColor = "#ca8a04";
      }

      // Delimita os cantos do pequeno quadrado
      const rectBounds = {
        north: lat + OFFSET,
        south: lat - OFFSET,
        east: lng + OFFSET,
        west: lng - OFFSET,
      };

      const rectangle = new window.google.maps.Rectangle({
        strokeColor: strokeColor,
        strokeOpacity: 0.85,
        strokeWeight: 1.5,
        fillColor: fillColor,
        fillOpacity: 0.45,
        map: map,
        bounds: rectBounds,
      });

      // Balão de informação ao clicar no quadrado
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 6px; color: #0f172a; font-family: sans-serif;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${item.title || item.name}</h4>
            <p style="margin: 2px 0; font-size: 12px;">Endereço: ${item.street || item.address || 'Não informado'}</p>
            <p style="margin: 2px 0; font-size: 12px;">Nota: <b>⭐ ${item.rating || 'Sem nota'}</b></p>
          </div>
        `,
      });

      rectangle.addListener("click", () => {
        infoWindow.setPosition({ lat, lng });
        infoWindow.open(map);
      });

      rectanglesRef.current.push(rectangle);
      bounds.extend({ lat, lng });
    });

    // Enquadra o zoom do mapa para focar na área com os pontos
    map.fitBounds(bounds);

  }, [cityHistory]);

  // 4. Dispara Novo Scraping
  const handleStartNewScrape = async () => {
    if (!location?.address) return;

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
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-md bg-slate-100 select-none">
      <div className="absolute inset-0 w-full h-full" ref={mapRef} />

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

      {showScrapePrompt && !isLoadingHistory && !isScraping && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex items-center justify-center p-4">
          <main className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-2">
              Deseja buscar os locais desta cidade?
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8">
              Buscamos os principais estabelecimentos e salvamos para você no banco.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowScrapePrompt(false)}
                className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 transition-colors"
              >
                Não
              </button>
              <button
                type="button"
                onClick={handleStartNewScrape}
                className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-semibold text-base hover:bg-amber-700 transition-colors shadow-sm"
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
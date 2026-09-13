"use client";

import { useEffect, useRef, useState } from "react";
import { useMapLocation } from "@/app/context/MapLocationContext";
import { useInputSearch } from "@/app/context/InputSearchContext";
import { useFilterContext } from "@/app/context/FilterContext"; // 1. IMPORTA O CONTEXTO DE FILTROS
import { fetchCityHistory } from "@/app/services/cityServices";
import { listenToScrapeJob, startScrapeJob } from "@/app/services/scrapingServices";
import { getShapesFromFirestore, getRatingColor } from "@/app/utils/geoGrid"; // 2. IMPORTA O GEOGRID

declare global {
  interface Window {
    google: any;
  }
}

export default function Map() {
  const setMapLocation = useMapLocation();
  const { location } = useInputSearch();
  const { filteringBy } = useFilterContext(); // 3. PEGA O FILTRO ATIVO (streets, districts, establishments, city)

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Guarda instâncias das formas desenhadas (Retângulos e Polígonos) para limpar e redesenhar
  const activeShapesRef = useRef<any[]>([]);

  // Estados locais
  const [cityHistory, setCityHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [showScrapePrompt, setShowScrapePrompt] = useState<boolean>(false);

  // Efeito 1: Renderiza / Inicializa o Google Maps
  useEffect(() => {
    if (!location || !mapRef.current || !window.google) return;

    const begPosition = {
      lat: location.lat,
      lng: location.lng,
    };

    const map = new window.google.maps.Map(mapRef.current, {
      center: begPosition,
      zoom: 13,
      restriction: location.bounds
        ? {
            latLngBounds: location.bounds,
            strictBounds: false,
          }
        : undefined,
    });

    mapInstanceRef.current = map;
  }, [location]);

  // Efeito 2: Consulta Firestore e decide se carrega dados antigos ou abre modal
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
          console.log("✅ Dados da cidade encontrados no Firestore:", historyData);
          setCityHistory(historyData);
          setShowScrapePrompt(false);
        } else {
          console.log("ℹ️ Nenhum histórico para esta cidade.");
          setCityHistory([]);
          setShowScrapePrompt(true);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    checkAndLoadHistory();
  }, [location]);

  // Efeito 3: Desenha os Formatos no Mapa com base nos Dados do Firestore + Filtro Selecionado
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !cityHistory.length) return;

    // A) Limpa formas desenhadas anteriormente (Retângulos e Polígonos)
    activeShapesRef.current.forEach((shape) => shape.setMap(null));
    activeShapesRef.current = [];

    // B) Separa os dados do history em "places" e "boundaries"
    const places = cityHistory.filter((item) => item.location?.lat && item.location?.lng);
    const boundaries = cityHistory.filter((item) => item.geojson);

    // C) Calcula as formas usando o geoGrid.ts
    const shapesToDraw = getShapesFromFirestore(places, boundaries, filteringBy as "streets" | "districts" | "establishments" | "city");

    // D) Desenha cada forma retornada na instância do Google Maps
    shapesToDraw.forEach((shape) => {
      const color = getRatingColor(shape.avgRating);
      let gMapShape: any;

      if (shape.type === "POLYGON" && shape.paths) {
        // Polígono GeoJSON (Usado para Bairros)
        gMapShape = new window.google.maps.Polygon({
          paths: shape.paths,
          strokeColor: color,
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          map,
        });
      } else if (shape.type === "RECTANGLE" && shape.bounds) {
        // Retângulo (Usado para Ruas, Estabelecimentos e Cidade Inteira)
        gMapShape = new window.google.maps.Rectangle({
          bounds: shape.bounds,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: color,
          fillOpacity: 0.45,
          map,
        });
      }

      if (gMapShape) {
        // Pop-up nativo do Google Maps ao clicar no retângulinho ou polígono
        gMapShape.addListener("click", (e: any) => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 6px; color: #0f172a; font-family: sans-serif;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${shape.label}</h4>
                <p style="margin: 2px 0; font-size: 12px;">Estabelecimentos: <b>${shape.totalPlaces}</b></p>
                <p style="margin: 2px 0; font-size: 12px;">Média: <b>⭐ ${shape.avgRating > 0 ? shape.avgRating.toFixed(1) : "Sem nota"}</b></p>
              </div>
            `,
            position: e.latLng,
          });
          infoWindow.open(map);
        });

        activeShapesRef.current.push(gMapShape);
      }
    });
  }, [cityHistory, filteringBy]); // Escuta as mudanças de cityHistory e de filteringBy!

  // Disparado ao clicar em "Sim" no modal
  const handleStartNewScrape = async () => {
    if (!location?.address) return;

    setIsScraping(true);
    setShowScrapePrompt(false);

    try {
      console.log("🚀 Disparando scraping para:", location.address);
      const data = await startScrapeJob({ cityName: location.address });

      listenToScrapeJob(
        data.runId,
        async () => {
          console.log("🎉 Scraping e GeoJSONs prontos! Recarregando...");
          const updatedHistory = await fetchCityHistory(location.address);
          setCityHistory(updatedHistory);
          setIsScraping(false);
        },
        (error) => {
          console.error("❌ Erro no processamento:", error);
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
      {/* Container do Google Maps */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center" ref={mapRef} />

      {/* Loading Overlay */}
      {(isLoadingHistory || isScraping) && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200">
            <span className="material-symbols-outlined animate-spin text-amber-600 text-[20px]">
              progress_activity
            </span>
            <span className="text-xs font-medium text-slate-800">
              {isScraping
                ? "Raspando dados e buscando fronteiras..."
                : "Buscando histórico da cidade..."}
            </span>
          </div>
        </div>
      )}

      {/* Modal Confirmar Raspagem */}
      {showScrapePrompt && !isLoadingHistory && !isScraping && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex items-center justify-center p-4">
          <main className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-2">
              Deseja atualizar o histórico da cidade?
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8">
              Recalcula os quadrantes e desenha os limites no mapa.
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
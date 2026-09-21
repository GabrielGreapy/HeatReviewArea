import { Place } from "../types";

declare global {
  interface Window {
    google: any;
  }
}

const OFFSET = 0.0002;

export function getRatingColors(rating: number) {
  if (rating >= 4.5) {
    return { fillColor: "#22c55e", strokeColor: "#16a34a" }; // 🟢 Verde (Excelente)
  }
  if (rating >= 4.0) {
    return { fillColor: "#eab308", strokeColor: "#ca8a04" }; // 🟡 Amarelo (Bom/Médio)
  }
  if (rating > 0) {
    return { fillColor: "#ef4444", strokeColor: "#dc2626" }; // 🔴 Vermelho (Abaixo de 4.0)
  }
  // ⚪ Cinza para estabelecimentos sem nota ou sem avaliações
  return { fillColor: "#9ca3af", strokeColor: "#6b7280" }; 
}

export function drawPlaceRectangles(
  map: any,
  places: Place[],
  existingRectangles: any[] = []
): any[] {
  existingRectangles.forEach((rect) => rect.setMap(null));

  const validPlaces = places.filter(
    (item) => item.location?.lat && item.location?.lng
  );

  if (!map || !window.google || validPlaces.length === 0) return [];

  const newRectangles: any[] = [];
  const bounds = new window.google.maps.LatLngBounds();

  validPlaces.forEach((item) => {
    const { lat, lng } = item.location;

    // 🟢 Extração robusta da nota (suporta rating, totalScore ou stars)
    const rawRating = item.rating ?? (item as any).totalScore ?? (item as any).stars ?? 0;
    const rating = typeof rawRating === "number" ? rawRating : parseFloat(rawRating) || 0;

    const { fillColor, strokeColor } = getRatingColors(rating);

    const rectBounds = {
      north: lat + OFFSET,
      south: lat - OFFSET,
      east: lng + OFFSET,
      west: lng - OFFSET,
    };

    const rectangle = new window.google.maps.Rectangle({
      strokeColor,
      strokeOpacity: 0.85,
      strokeWeight: 1.5,
      fillColor,
      fillOpacity: 0.45,
      map,
      bounds: rectBounds,
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 6px; color: #0f172a; font-family: sans-serif;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${item.title || item.name}</h4>
          <p style="margin: 2px 0; font-size: 12px;">Endereço: ${item.street || item.address || 'Não informado'}</p>
          <p style="margin: 2px 0; font-size: 12px;">Nota: <b>${rating > 0 ? `⭐ ${rating.toFixed(1)}` : '⚪ Sem nota'}</b></p>
        </div>
      `,
    });

    rectangle.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.open(map);
    });

    newRectangles.push(rectangle);
    bounds.extend({ lat, lng });
  });

  map.fitBounds(bounds);

  return newRectangles;
}
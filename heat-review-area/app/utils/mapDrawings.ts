import { Place } from "../types";

declare global {
  interface Window {
    google: any;
  }
}

const OFFSET = 0.0012; // Tamanho do quadrado ao redor do ponto (~150m)

/**
 * Retorna as cores de preenchimento e borda conforme a nota do local
 */
export function getRatingColors(rating: number) {
  if (rating >= 4.5) {
    return { fillColor: "#22c55e", strokeColor: "#16a34a" }; // Verde
  }
  if (rating >= 4.0) {
    return { fillColor: "#eab308", strokeColor: "#ca8a04" }; // Amarelo
  }
  return { fillColor: "#ef4444", strokeColor: "#dc2626" }; // Vermelho
}

/**
 * Desenha os quadrados individuais no mapa e retorna as instâncias criadas
 */
export function drawPlaceRectangles(
  map: any,
  places: Place[],
  existingRectangles: any[] = []
): any[] {
  // 1. Limpa retângulos antigos
  existingRectangles.forEach((rect) => rect.setMap(null));

  const validPlaces = places.filter(
    (item) => item.location?.lat && item.location?.lng
  );

  if (!map || !window.google || validPlaces.length === 0) return [];

  const newRectangles: any[] = [];
  const bounds = new window.google.maps.LatLngBounds();

  // 2. Desenha cada retângulo
  validPlaces.forEach((item) => {
    const { lat, lng } = item.location;
    const rating = item.rating || 0;
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

    // 3. Adiciona a janela de informações ao clicar
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

    newRectangles.push(rectangle);
    bounds.extend({ lat, lng });
  });

  // 4. Ajusta o enquadramento da câmera
  map.fitBounds(bounds);

  return newRectangles;
}
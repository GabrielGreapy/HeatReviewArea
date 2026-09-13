// app/utils/geoGrid.ts

export interface PlaceDocument {
  id: string;
  title: string;
  rating: number;
  street?: string;
  neighborhood?: string;
  city?: string;
  location: { lat: number; lng: number };
}

export interface BoundaryDocument {
  id: string;
  name: string;
  city: string;
  geojson: {
    type: string;
    coordinates: any; // Suporta tanto Polygon quanto MultiPolygon
  };
}

export interface LatLngBoundsLiteral {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MapShape {
  id: string;
  type: "RECTANGLE" | "POLYGON";
  bounds?: LatLngBoundsLiteral;
  paths?: LatLngLiteral[];
  label: string;
  avgRating: number;
  totalPlaces: number;
}

export function getShapesFromFirestore(
  places: PlaceDocument[],
  boundaries: BoundaryDocument[],
  filteringBy: "streets" | "districts" | "establishments" | "city"
): MapShape[] {
  if (!places || places.length === 0) return [];

  // -------------------------------------------------------------
  // MODO 1: ESTABELECIMENTOS (Micro-quadrado em cada local)
  // -------------------------------------------------------------
  if (filteringBy === "establishments") {
    const microOffset = 0.0003; // ~30 metros em volta do ponto da coordenada
    return places.map((place) => ({
      id: place.id,
      type: "RECTANGLE",
      bounds: {
        north: place.location.lat + microOffset,
        south: place.location.lat - microOffset,
        east: place.location.lng + microOffset,
        west: place.location.lng - microOffset,
      },
      label: place.title,
      avgRating: place.rating,
      totalPlaces: 1,
    }));
  }

  // -------------------------------------------------------------
  // MODO 2: RUAS (Quadrados delimitando cada rua salva no Firestore)
  // -------------------------------------------------------------
  if (filteringBy === "streets") {
    const streetGroups: { [streetName: string]: PlaceDocument[] } = {};

    places.forEach((p) => {
      const streetName = p.street || "Rua Sem Nome";
      if (!streetGroups[streetName]) streetGroups[streetName] = [];
      streetGroups[streetName].push(p);
    });

    return Object.entries(streetGroups).map(([streetName, group]) => {
      const lats = group.map((p) => p.location.lat);
      const lngs = group.map((p) => p.location.lng);

      const padding = 0.0004; // Margem para delimitar a rua visualmente
      const avgRating =
        group.reduce((sum, p) => sum + p.rating, 0) / group.length;

      return {
        id: `street_${streetName}`,
        type: "RECTANGLE",
        bounds: {
          north: Math.max(...lats) + padding,
          south: Math.min(...lats) - padding,
          east: Math.max(...lngs) + padding,
          west: Math.min(...lngs) - padding,
        },
        label: `Rua: ${streetName}`,
        avgRating,
        totalPlaces: group.length,
      };
    });
  }

  // -------------------------------------------------------------
  // MODO 3: BAIRROS (Polígonos GeoJSON da coleção 'boundaries')
  // -------------------------------------------------------------
  if (filteringBy === "districts") {
    // Se temos GeoJSONs de bairros no Firestore, desenha os polígonos reais
    if (boundaries && boundaries.length > 0) {
      return boundaries.map((b) => {
        // Encontra os lugares pertencentes a esse bairro para calcular a média
        const placesInDistrict = places.filter(
          (p) => p.neighborhood?.toLowerCase() === b.name.toLowerCase()
        );

        const avgRating =
          placesInDistrict.length > 0
            ? placesInDistrict.reduce((sum, p) => sum + p.rating, 0) /
              placesInDistrict.length
            : 0;

        // Trata a estrutura do GeoJSON para aceitar tanto Polygon quanto MultiPolygon
        let rawCoords = b.geojson.coordinates;
        if (b.geojson.type === "MultiPolygon") {
          rawCoords = rawCoords[0] ? rawCoords[0][0] : [];
        } else {
          rawCoords = rawCoords[0] || [];
        }

        const paths = rawCoords.map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0],
        }));

        return {
          id: b.id,
          type: "POLYGON",
          paths,
          label: `Bairro: ${b.name}`,
          avgRating,
          totalPlaces: placesInDistrict.length,
        };
      });
    }

    // Fallback caso não haja GeoJSON no Firestore: agrupa pelo campo 'neighborhood' dos lugares
    const districtGroups: { [name: string]: PlaceDocument[] } = {};
    places.forEach((p) => {
      const bName = p.neighborhood || "Outros";
      if (!districtGroups[bName]) districtGroups[bName] = [];
      districtGroups[bName].push(p);
    });

    return Object.entries(districtGroups).map(([bName, group]) => {
      const lats = group.map((p) => p.location.lat);
      const lngs = group.map((p) => p.location.lng);
      const padding = 0.001;
      const avgRating =
        group.reduce((sum, p) => sum + p.rating, 0) / group.length;

      return {
        id: `district_${bName}`,
        type: "RECTANGLE",
        bounds: {
          north: Math.max(...lats) + padding,
          south: Math.min(...lats) - padding,
          east: Math.max(...lngs) + padding,
          west: Math.min(...lngs) - padding,
        },
        label: `Bairro: ${bName}`,
        avgRating,
        totalPlaces: group.length,
      };
    });
  }

  // -------------------------------------------------------------
  // MODO 4: CIDADE INTEIRA (Um grande retângulo cobrindo todos os pontos)
  // -------------------------------------------------------------
  if (filteringBy === "city") {
    const lats = places.map((p) => p.location.lat);
    const lngs = places.map((p) => p.location.lng);
    const avgRating =
      places.reduce((sum, p) => sum + p.rating, 0) / places.length;
    const padding = 0.005;

    return [
      {
        id: "city_macro",
        type: "RECTANGLE",
        bounds: {
          north: Math.max(...lats) + padding,
          south: Math.min(...lats) - padding,
          east: Math.max(...lngs) + padding,
          west: Math.min(...lngs) - padding,
        },
        label: `Cidade (Visão Geral)`,
        avgRating,
        totalPlaces: places.length,
      },
    ];
  }

  return [];
}

// Retorna a cor baseada na nota média do agrupamento
export function getRatingColor(rating: number): string {
  if (rating === 0) return "#9ca3af"; // Sem nota (Cinza)
  if (rating >= 4.5) return "#22c55e"; // Verde
  if (rating >= 3.8) return "#84cc16"; // Verde Limão
  if (rating >= 3.0) return "#eab308"; // Amarelo
  if (rating >= 2.0) return "#f97316"; // Laranja
  return "#ef4444"; // Vermelho
}
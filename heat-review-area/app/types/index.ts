// Estrutura do estabelecimento salvo no Firestore
export interface Place {
  id?: string;
  title?: string;
  name?: string;
  rating?: number;
  reviewsCount?: number;
  categoryName?: string;
  address?: string;
  street?: string;
  neighborhood?: string;
  cityNameSearch: string;
  location: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  url?: string;
}


export interface ScrapeParams {
  cityName: string;
  maxPlaces?: number;
  maxReviews?: number;
}

export interface ScrapeJob {
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  error?: string;
  cityName?: string;
}

export interface LoadedAnalysis {
  id: string,
    cityName : string,
  hourOfAnalisis : string,
    status : "COMPLETED" | "SCRAPING" | "ERROR"

}
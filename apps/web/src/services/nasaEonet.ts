export interface NasaEventCategory {
  id: string;
  title: string;
}

export interface NasaEventGeometry {
  magnitudeValue: number;
  magnitudeUnit: string;
  date: string;
  type: string;
  coordinates: [number, number];
}

export interface NasaEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: NasaEventCategory[];
  sources: { id: string; url: string }[];
  geometry: NasaEventGeometry[];
}

export interface NasaEventsResponse {
  title: string;
  description: string;
  link: string;
  events: NasaEvent[];
}

export async function fetchNasaEvents(limit: number = 10): Promise<NasaEventsResponse> {
  try {
    // Bounding box for India: min_lon, min_lat, max_lon, max_lat
    const INDIA_BBOX = "68.7,8.4,97.25,37.6";
    const res = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}&bbox=${INDIA_BBOX}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch NASA EONET data: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching NASA EONET events:", error);
    throw error;
  }
}


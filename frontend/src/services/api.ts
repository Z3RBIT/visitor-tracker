import axios from "axios";
import type { VisitorData, VisitorResponse, StatsData } from "../types/visitor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  headers: { "Content-Type": "application/json" },
});

// Obtener info de IP via ipapi.co
export const getIPInfo = async (): Promise<Partial<VisitorData>> => {
  try {
    const { data } = await axios.get("https://ipapi.co/json/");
    return {
      network: {
        ip: data.ip || "Unknown",
        isp: data.org || "Unknown",
        timezone: data.timezone || "Unknown",
      },
      location: {
        country: data.country_name || "Unknown",
        countryCode: data.country_code || "Unknown",
        region: data.region || "Unknown",
        city: data.city || "Unknown",
        lat: data.latitude || null,
        lon: data.longitude || null,
        source: "ip",
      },
    };
  } catch {
    return {};
  }
};

// Guardar visitante en el backend
export const saveVisitor = async (
  visitorData: VisitorData,
): Promise<VisitorResponse> => {
  const { data } = await api.post("/visitors", visitorData);
  return data.data;
};

// Obtener todos los visitantes
export const getVisitors = async (params?: {
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  country?: string;
}): Promise<VisitorResponse[]> => {
  const { data } = await api.get("/visitors", { params });
  return data.data;
};

// Obtener estadísticas
export const getStats = async (): Promise<StatsData> => {
  const { data } = await api.get("/visitors/stats");
  return data.data;
};

// Obtener visitante por ID
export const getVisitorById = async (id: string): Promise<VisitorResponse> => {
  const { data } = await api.get(`/visitors/${id}`);
  return data.data;
};

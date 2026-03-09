import { useState, useEffect } from "react";
import type { VisitorData } from "../types/visitor";
import getBrowser from "../utils/getBrowser";
import { getOS, getDeviceInfo } from "../utils/getDeviceInfo";
import { getIPInfo, saveVisitor } from "../services/api";
import useGeolocation from "./useGeolocation";

interface VisitorState {
  data: VisitorData | null;
  savedId: string | null;
  loading: boolean;
  error: string | null;
  locationPermission: "idle" | "granted" | "denied";
}

const useVisitorInfo = () => {
  const [state, setState] = useState<VisitorState>({
    data: null,
    savedId: null,
    loading: true,
    error: null,
    locationPermission: "idle",
  });

  const { requestLocation, permission } = useGeolocation();

  useEffect(() => {
    const collect = async () => {
      try {
        // 1. Info del navegador
        const browser = getBrowser();

        // 2. Info del OS y dispositivo
        const os = getOS();
        const device = await getDeviceInfo();

        // 3. Sesión
        const session = {
          referrer: document.referrer || "Direct",
          userAgent: navigator.userAgent,
        };

        // 4. Info de IP (respaldo)
        const ipInfo = await getIPInfo();

        // 5. Solicitar GPS
        const gpsLocation = await requestLocation();

        // 6. Combinar location — GPS tiene prioridad sobre IP
        const location = gpsLocation
          ? {
              country:
                gpsLocation.country || ipInfo.location?.country || "Unknown",
              countryCode:
                gpsLocation.countryCode ||
                ipInfo.location?.countryCode ||
                "Unknown",
              region:
                gpsLocation.region || ipInfo.location?.region || "Unknown",
              city: gpsLocation.city || ipInfo.location?.city || "Unknown",
              lat: gpsLocation.lat || null,
              lon: gpsLocation.lon || null,
              source: "gps" as const,
            }
          : {
              country: ipInfo.location?.country || "Unknown",
              countryCode: ipInfo.location?.countryCode || "Unknown",
              region: ipInfo.location?.region || "Unknown",
              city: ipInfo.location?.city || "Unknown",
              lat: ipInfo.location?.lat || null,
              lon: ipInfo.location?.lon || null,
              source: "ip" as const,
            };

        // 7. Construir objeto completo
        const visitorData: VisitorData = {
          network: ipInfo.network || {
            ip: "Unknown",
            isp: "Unknown",
            timezone: "Unknown",
          },
          location,
          browser,
          os,
          device,
          session,
        };

        // 8. Guardar en backend
        const saved = await saveVisitor(visitorData);

        setState({
          data: visitorData,
          savedId: saved.id,
          loading: false,
          error: null,
          locationPermission: permission,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Error al recopilar información del visitante",
        }));
      }
    };

    collect();
  }, []);

  return state;
};

export default useVisitorInfo;

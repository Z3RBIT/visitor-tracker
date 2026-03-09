import { useState } from "react";
import type { LocationInfo } from "../types/visitor";

const reverseGeocode = async (
  lat: number,
  lon: number,
): Promise<Partial<LocationInfo>> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "es" } },
    );
    const data = await response.json();

    return {
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "Unknown",
      region: data.address?.state || data.address?.county || "Unknown",
      country: data.address?.country || "Unknown",
      countryCode: data.address?.country_code?.toUpperCase() || "Unknown",
    };
  } catch {
    return {};
  }
};

const useGeolocation = () => {
  const [location, setLocation] = useState<Partial<LocationInfo> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<"idle" | "granted" | "denied">(
    "idle",
  );

  const requestLocation = async (): Promise<Partial<LocationInfo> | null> => {
    if (!navigator.geolocation) {
      setError("Geolocation no soportada en este navegador");
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPermission("granted");

          const geoData = await reverseGeocode(latitude, longitude);

          const locationData: Partial<LocationInfo> = {
            lat: latitude,
            lon: longitude,
            source: "gps",
            ...geoData,
          };

          setLocation(locationData);
          setLoading(false);
          resolve(locationData);
        },
        (err) => {
          setPermission("denied");
          setError(err.message);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  };

  return { location, loading, error, permission, requestLocation };
};

export default useGeolocation;

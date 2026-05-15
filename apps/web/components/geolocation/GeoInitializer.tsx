// ============================================================
// COMPONENT: Geo Initializer
// PURPOSE: Detect and store user location for regional content
// ============================================================

"use client";

import { useEffect, useState } from "react";
import {
  detectUserLocation,
  setCityCookie,
  getCityFromCookies,
} from "@/lib/utils/geolocation";
import { Loader2 } from "lucide-react";

export default function GeoInitializer({
  children,
  onLocationDetected,
}: {
  children: React.ReactNode;
  onLocationDetected?: (cityId: string | null, cityName: string | null) => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initGeo = async () => {
      const existingCity = getCityFromCookies();

      if (existingCity) {
        setLoading(false);
        return;
      }

      const location = await detectUserLocation();

      if (location.cityId && location.cityName) {
        setCityCookie(location.cityId, location.cityName);
        onLocationDetected?.(location.cityId, location.cityName);
      } else if (location.cityName) {
        onLocationDetected?.(null, location.cityName);
      }

      setLoading(false);
    };

    initGeo();
  }, [onLocationDetected]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          color: "var(--clr-text-secondary)",
        }}
      >
        <Loader2 className="animate-spin" size={24} />
        <span style={{ marginLeft: "8px" }}>Detectando ubicación...</span>
      </div>
    );
  }

  return <>{children}</>;
}

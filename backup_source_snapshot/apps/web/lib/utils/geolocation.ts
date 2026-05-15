"use client";

export interface GeoLocation {
  cityId: string | null;
  cityName: string | null;
  countryCode: string | null;
  currency: string;
}

const FALLBACK_GEO: GeoLocation = {
  cityId: null,
  cityName: "Ecuador",
  countryCode: "EC",
  currency: "USD",
};

const CITY_MAPPING: Record<
  string,
  { cityId: string; name: string; currency: string }
> = {
  guayaquil: { cityId: "guayaquil", name: "Guayaquil", currency: "USD" },
  quito: { cityId: "quito", name: "Quito", currency: "USD" },
  cuenca: { cityId: "cuenca", name: "Cuenca", currency: "USD" },
  manta: { cityId: "manta", name: "Manta", currency: "USD" },
  latacunga: { cityId: "latacunga", name: "Latacunga", currency: "USD" },
  ambato: { cityId: "ambato", name: "Ambato", currency: "USD" },
  riobamba: { cityId: "riobamba", name: "Riobamba", currency: "USD" },
  ibarra: { cityId: "ibarra", name: "Ibarra", currency: "USD" },
  machala: { cityId: "machala", name: "Machala", currency: "USD" },
  quevedo: { cityId: "quevedo", name: "Quevedo", currency: "USD" },
};

export async function detectUserLocation(): Promise<GeoLocation> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn("Geolocation API failed, using fallback");
      return FALLBACK_GEO;
    }

    const data = await response.json();

    const cityKey = data.city?.toLowerCase() || "";
    const mappedCity = CITY_MAPPING[cityKey];

    if (mappedCity) {
      return {
        cityId: mappedCity.cityId,
        cityName: mappedCity.name,
        countryCode: data.country_code || "EC",
        currency: mappedCity.currency,
      };
    }

    if (data.country_code === "EC") {
      return {
        cityId: null,
        cityName: data.city || "Ecuador",
        countryCode: "EC",
        currency: "USD",
      };
    }

    return FALLBACK_GEO;
  } catch (error) {
    console.error("Error detecting location:", error);
    return FALLBACK_GEO;
  }
}

export function getCityFromCookies(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "saidon-city-id") {
      return value;
    }
  }
  return null;
}

export function setCityCookie(cityId: string, cityName: string) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  document.cookie = `saidon-city-id=${cityId};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = `saidon-city-name=${encodeURIComponent(cityName)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

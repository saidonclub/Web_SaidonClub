'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCities, detectCity } from '@/lib/actions/location';

interface District {
  id: string;
  name: string;
  cityId: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
  provinceId?: string | null;
  province?: {
    id: string;
    name: string;
  } | null;
}

interface LocationContextType {
  currentCity: City | null;
  currentDistrict: District | null;
  radius: number;
  cities: City[];
  districts: District[];
  setCity: (city: City) => void;
  setDistrict: (district: District) => void;
  setRadius: (radius: number) => void;
  isLoading: boolean;
  refreshCities: (provinceId?: string) => Promise<void>;
  refreshDistricts: (cityId?: string) => Promise<void>;
  setLocationFromGoogle: (hierarchy: unknown) => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ 
  children,
  initialCity: serverCity,
  initialDistrict: serverDistrict
}: { 
  children: React.ReactNode;
  initialCity?: City | null;
  initialDistrict?: District | null;
}) {
  const [currentCity, setCurrentCityState] = useState<City | null>(serverCity || null);
  const [currentDistrict, setCurrentDistrictState] = useState<District | null>(serverDistrict || null);
  const [radius, setRadiusState] = useState(20);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(!serverCity);
  const router = useRouter();

  const setRadius = (r: number) => {
    setRadiusState(r);
    document.cookie = `saidon-radius=${r}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  useEffect(() => {
    // ... logic to read cookie for radius ...
    const cookies = document.cookie.split('; ');
    const radiusCookie = cookies.find(row => row.startsWith('saidon-radius='));
    if (radiusCookie) setRadiusState(parseInt(radiusCookie.split('=')[1]) || 20);
  }, []);

  const refreshCities = async (provinceId?: string) => {
    setIsLoading(true);
    try {
      const availableCities = await getCities(provinceId);
      setCities(availableCities);
    } catch (error) {
      console.error("Failed to refresh cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDistricts = async (cityId?: string) => {
    setIsLoading(true);
    try {
      const { getDistricts } = await import('@/lib/actions/location');
      const availableDistricts = await getDistricts(cityId);
      setDistricts(availableDistricts);
    } catch (error) {
      console.error("Failed to refresh districts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function initLocation() {
      // If we already have a city from server, we just need to populate the dropdown lists
      if (serverCity) {
        try {
          const { getCities, getDistricts } = await import('@/lib/actions/location');
          
          if (serverCity.provinceId) {
            const provinceCities = await getCities(serverCity.provinceId);
            setCities(provinceCities);
          } else {
            setCities([serverCity]);
          }

          const cityDistricts = await getDistricts(serverCity.id);
          setDistricts(cityDistricts);
        } catch (error) {
          console.error("Failed to populate location lists:", error);
        }
        return;
      }

      // If no server city, run full initialization
      setIsLoading(true);
      try {
        const cookies = document.cookie.split('; ');
        const cityIdCookie = cookies.find(row => row.startsWith('saidon-city-id='));
        const districtIdCookie = cookies.find(row => row.startsWith('saidon-district-id='));
        
        let initialCity: City | null = null;
        
        const { getCityById, getCities } = await import('@/lib/actions/location');

        if (cityIdCookie) {
          const cityId = cityIdCookie.split('=')[1];
          initialCity = await getCityById(cityId);
        }

        if (!initialCity) {
          const detected = await detectCity();
          if (detected) {
            initialCity = detected;
          } else {
            // Hard fallback if DB is empty or Quito not found
            initialCity = {
              id: "quito-default",
              name: "Quito",
              countryId: "ec",
              provinceId: "pichincha-default"
            };
          }
        }

        if (initialCity) {
          setCurrentCityState(initialCity);
          
          // Solo cargar ciudades de la provincia actual
          if (initialCity.provinceId && initialCity.id !== "quito-default") {
            const provinceCities = await getCities(initialCity.provinceId);
            setCities(provinceCities);
          } else {
            setCities([initialCity]);
          }

          // Load districts for this city
          const { getDistricts } = await import('@/lib/actions/location');
          const cityDistricts = initialCity.id === "quito-default" ? [] : await getDistricts(initialCity.id);
          setDistricts(cityDistricts);

          if (districtIdCookie) {
            const distId = districtIdCookie.split('=')[1];
            const savedDist = cityDistricts.find(d => d.id === distId);
            if (savedDist) setCurrentDistrictState(savedDist);
          }
        }
      } catch (error) {
        console.error("Failed to initialize location:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initLocation();
  }, [serverCity]);

  const setCity = (city: City) => {
    setCurrentCityState(city);
    setCurrentDistrictState(null);
    document.cookie = `saidon-city-id=${city.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `saidon-district-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    // Refresh server components so they re-read the new city cookie
    setTimeout(() => router.refresh(), 50);
  };

  const setDistrict = (district: District) => {
    setCurrentDistrictState(district);
    document.cookie = `saidon-district-id=${district.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  const setLocationFromGoogle = async (hierarchy: unknown) => {
    const h = hierarchy as Record<string, unknown>;
    setIsLoading(true);
    try {
      const { matchLocationFromGoogle } = await import('@/lib/actions/location');
      const { city, district } = await matchLocationFromGoogle({
        city: h.city as string,
        province: h.province as string,
        country: h.country as string,
        district: h.district as string,
        lat: h.latitude as number,
        lon: h.longitude as number
      });

      if (city) {
        setCurrentCityState(city);
        document.cookie = `saidon-city-id=${city.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
        
        if (district) {
          setCurrentDistrictState(district);
          document.cookie = `saidon-district-id=${district.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
        } else {
          setCurrentDistrictState(null);
          document.cookie = `saidon-district-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        }

        // Refresh to update server-side products
        setTimeout(() => router.refresh(), 50);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to set location from Google:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <LocationContext.Provider value={{ 
      currentCity, 
      currentDistrict,
      radius,
      cities, 
      districts,
      setCity, 
      setDistrict,
      setRadius,
      isLoading, 
      refreshCities,
      refreshDistricts,
      setLocationFromGoogle
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

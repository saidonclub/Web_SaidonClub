'use server';

import { prisma } from "@/lib/prisma";

export async function getCountries() {
  try {
    return await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

export async function getProvinces(countryId?: string) {
  try {
    return await prisma.province.findMany({
      where: { 
        isActive: true,
        ...(countryId ? { countryId } : {})
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

export async function getCities(provinceId?: string) {
  try {
    return await prisma.city.findMany({
      where: { 
        isActive: true,
        ...(provinceId ? { provinceId } : {})
      },
      include: {
        country: true,
        province: true
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

export async function detectCity() {
  try {
    const defaultCity = await prisma.city.findFirst({
      where: { name: "Quito" },
      include: {
        country: true,
        province: true
      }
    });
    return defaultCity;
  } catch (error) {
    console.error("Error detecting city:", error);
    return null;
  }
}

export async function getCityById(id: string) {
  try {
    return await prisma.city.findUnique({
      where: { id },
      include: {
        country: true,
        province: true
      }
    });
  } catch (error) {
    console.error("Error fetching city by id:", error);
    return null;
  }
}

export async function getDistricts(cityId?: string) {
  try {
    return await prisma.district.findMany({
      where: { 
        isActive: true,
        ...(cityId ? { cityId } : {})
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
}

export async function getDistrictById(id: string) {
  try {
    return await prisma.district.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Error fetching district by id:", error);
    return null;
  }
}

// Cálculo de distancia de Haversine (en km)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radio de la tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

export async function getNearestCity(lat: number, lon: number) {
  try {
    // Select only coordinates to minimize memory and bandwidth overhead
    const cities = await prisma.city.findMany({
      where: { 
        isActive: true,
        lat: { not: null },
        lon: { not: null }
      },
      select: {
        id: true,
        lat: true,
        lon: true
      }
    });

    if (!cities.length) return null;

    let nearestCityId = cities[0].id;
    let minDistance = Infinity;

    for (const city of cities) {
      if (city.lat && city.lon) {
        const cityLat = Number(city.lat);
        const cityLon = Number(city.lon);
        const distance = getDistanceFromLatLonInKm(lat, lon, cityLat, cityLon);
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestCityId = city.id;
        }
      }
    }

    // Fetch the full nearest city with relations
    return await prisma.city.findUnique({
      where: { id: nearestCityId },
      include: {
        country: true,
        province: true
      }
    });
  } catch (error) {
    console.error("Error finding nearest city:", error);
    return null;
  }
}

export async function matchLocationFromGoogle(data: {
  city?: string;
  province?: string;
  country?: string;
  district?: string;
  lat?: number;
  lon?: number;
}) {
  try {
    // 1. Try to find the city directly by name and province/country
    let city = await prisma.city.findFirst({
      where: {
        name: { contains: data.city, mode: 'insensitive' },
        isActive: true,
        ...(data.province ? {
          province: {
            name: { contains: data.province, mode: 'insensitive' }
          }
        } : {})
      },
      include: {
        country: true,
        province: true
      }
    });

    // 2. If not found by name, try finding by coordinates (if provided)
    if (!city && data.lat && data.lon) {
      city = await getNearestCity(data.lat, data.lon);
    }

    // 3. If we found a city, try to find the district
    let district = null;
    if (city && data.district) {
      district = await prisma.district.findFirst({
        where: {
          cityId: city.id,
          name: { contains: data.district, mode: 'insensitive' },
          isActive: true
        }
      });
    }

    return { city, district };
  } catch (error) {
    console.error("Error matching location from Google:", error);
    return { city: null, district: null };
  }
}

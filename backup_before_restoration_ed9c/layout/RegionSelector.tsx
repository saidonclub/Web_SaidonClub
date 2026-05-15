/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
// ============================================================
// COMPONENT: Region Selector
// PURPOSE: Dropdown to select country/region for pricing and content
// ============================================================

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  ChevronDown,
  Check,
  Globe,
  Navigation,
  X,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/context/LocationContext";
import {
  getCountries,
  getProvinces,
  getNearestCity,
} from "@/lib/actions/location";
import styles from "./RegionSelector.module.css";
import LocationSearch from "../shared/LocationSearch";

interface Country {
  id: string;
  name: string;
  flag?: string | null;
}
interface Province {
  id: string;
  name: string;
  countryId: string;
}

// Posición del dropdown calculada en coordenadas de viewport (fixed)
interface DropPos {
  top: number;
  left: number;
  width: number;
}

const RADIUS_OPTIONS = [1, 5, 10, 20, 50, 100];

const RegionSelector = () => {
  const {
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
  } = useLocation();

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "pais" | "provincia" | "ciudad" | "distrito"
  >("ciudad");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropPos, setDropPos] = useState<DropPos | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(
    currentCity?.countryId || "ec",
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    currentCity?.provinceId || null,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    currentCity?.id || null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular posición del trigger para el dropdown fixed
  const calcPos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 600;
    const dropWidth = isMobile ? window.innerWidth * 0.92 : 360;

    let left = isMobile ? window.innerWidth * 0.04 : rect.left;

    // Boundary check for desktop
    if (!isMobile && left + dropWidth > window.innerWidth) {
      left = window.innerWidth - dropWidth - 20;
    }

    setDropPos((prev) => {
      const newTop = rect.bottom + 10;
      if (
        prev &&
        prev.top === newTop &&
        prev.left === left &&
        prev.width === dropWidth
      ) {
        return prev;
      }
      return { top: newTop, left, width: dropWidth };
    });
  }, []);

  // Abrir/cerrar
  const toggle = () => {
    if (!isOpen) {
      calcPos();
      setSearchQuery("");
    }
    setIsOpen((v) => !v);
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (
        containerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  // Recalcular posición si el scroll o resize cambian
  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => calcPos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [isOpen, calcPos]);

  // Cargar países y provincias
  useEffect(() => {
    async function loadInitialData() {
      const c = await getCountries();
      // Transformar para solo tener las props que necesitamos
      const countries = c.map((country: { id: string; name: string; flag?: string | null }) => ({
        id: country.id,
        name: country.name,
        flag: country.flag ?? undefined,
      }));
      // Si no hay datos, populamos con Latam básico para no estar vacíos
      setCountries(
        countries.length > 0
          ? countries
          : [
              { id: "ec", name: "Ecuador", flag: "🇪🇨" },
              { id: "co", name: "Colombia", flag: "🇨🇴" },
              { id: "pe", name: "Perú", flag: "🇵🇪" },
              { id: "ar", name: "Argentina", flag: "🇦🇷" },
              { id: "cl", name: "Chile", flag: "🇨🇱" },
              { id: "mx", name: "México", flag: "🇲🇽" },
            ],
      );
      if (selectedCountry) {
        const p = await getProvinces(selectedCountry);
        setProvinces(p);
      }
    }
    loadInitialData();
  }, [selectedCountry]);

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const nearestCity = await getNearestCity(lat, lon);
            if (nearestCity) {
              setCity(nearestCity);
              // Reset district - use type assertion for the reset value
              setDistrict({
                id: "",
                name: "Sin distrito",
                cityId: nearestCity.id,
              });
              setSelectedCountry(nearestCity.countryId);
              if (nearestCity.provinceId) {
                setSelectedProvince(nearestCity.provinceId);
              }
              // Cargar provincias si es necesario
              const p = await getProvinces(nearestCity.countryId);
              setProvinces(p);
              await refreshCities(nearestCity.provinceId || "");
            } else {
              alert(
                "No se pudo encontrar una ciudad cercana en nuestra base de datos.",
              );
            }
          } catch (error) {
            console.error("Error detectando ubicación:", error);
            alert("Error al detectar la ubicación.");
          } finally {
            setIsOpen(false);
          }
        },
        () => alert("Activa los permisos de GPS para detección automática."),
      );
    }
  };

  // Filtrado inteligente
  const filteredOptions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (activeTab === "pais") {
      return countries.filter((c) => c.name.toLowerCase().includes(query));
    }
    if (activeTab === "provincia") {
      return provinces.filter((p) => p.name.toLowerCase().includes(query));
    }
    if (activeTab === "ciudad") {
      return cities.filter(
        (c) =>
          c.name.toLowerCase().includes(query) &&
          (!selectedProvince || c.provinceId === selectedProvince),
      );
    }
    if (activeTab === "distrito") {
      return districts.filter(
        (d) =>
          d.name.toLowerCase().includes(query) &&
          (!selectedCity || d.cityId === selectedCity),
      );
    }
    return [];
  }, [
    activeTab,
    searchQuery,
    countries,
    provinces,
    cities,
    districts,
    selectedProvince,
    selectedCity,
  ]);

  const dropdownContent =
    isOpen && dropPos ? (
      <div
        ref={dropdownRef}
        className={styles.dropdown}
        style={{
          position: "fixed",
          top: dropPos.top,
          left: dropPos.left,
          width: dropPos.width,
          zIndex: 2147483647,
        }}
      >
        {/* Hierarchical Search (Google Powered) */}
        <div className={styles.searchSection}>
          <LocationSearch 
            onSelect={() => setIsOpen(false)} 
            className={styles.googleSearch}
            countryCode={selectedCountry}
          />
        </div>

        {/* Manual Navigation Header */}
        <div className={styles.manualNavigationHeader}>
          <div className={styles.manualLabel}>O navega manualmente:</div>
          <button type="button" className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={14} />
          </button>
        </div>

        {/* Header Tabs */}
        <div className={styles.dropdownHeader}>
          <div className={styles.tabs}>
            {(["pais", "provincia", "ciudad", "distrito"] as const).map(
              (tab) => {
                const isDisabled =
                  (tab === "provincia" && !selectedCountry) ||
                  (tab === "ciudad" && !selectedProvince) ||
                  (tab === "distrito" && !selectedCity);
                return (
                  <button
                    key={tab}
                    type="button"
                    disabled={isDisabled}
                    className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSearchQuery("");
                    }}
                  >
                    {tab === "pais"
                      ? "País"
                      : tab === "provincia"
                        ? "Estado"
                        : tab === "ciudad"
                          ? "Ciudad"
                          : "Sector"}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Lista */}
        <div className={styles.scrollArea}>
          {activeTab === "ciudad" && searchQuery === "" && (
            <button type="button" className={styles.locationBtn} onClick={handleUseLocation}>
              <Navigation size={12} />
              Detección automática (GPS)
            </button>
          )}

          <div className={styles.optionsList}>
            {activeTab === "distrito" && (
              <div
                className={`${styles.option} ${!currentDistrict ? styles.activeOption : ""}`}
                onClick={() => {
                  const city = cities.find((c) => c.id === selectedCity);
                  if (city) setCity(city);
                  setIsOpen(false);
                }}
              >
                <span className={styles.allOption}>Toda la ciudad</span>
                <Target size={10} />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt: any) => (
                <div
                  key={opt.id}
                  className={`${styles.option} ${
                    (activeTab === "pais" && selectedCountry === opt.id) ||
                    (activeTab === "provincia" &&
                      selectedProvince === opt.id) ||
                    (activeTab === "ciudad" && selectedCity === opt.id) ||
                    (activeTab === "distrito" && currentDistrict?.id === opt.id)
                      ? styles.activeOption
                      : ""
                  }`}
                  onClick={async () => {
                    if (activeTab === "pais") {
                      setSelectedCountry(opt.id);
                      setSelectedProvince(null);
                      setSelectedCity(null);
                      const p = await getProvinces(opt.id);
                      setProvinces(p);
                      setActiveTab("provincia");
                    } else if (activeTab === "provincia") {
                      setSelectedProvince(opt.id);
                      setSelectedCity(null);
                      await refreshCities(opt.id);
                      setActiveTab("ciudad");
                    } else if (activeTab === "ciudad") {
                      setSelectedCity(opt.id);
                      await refreshDistricts(opt.id);
                      setActiveTab("distrito");
                    } else {
                      const city = cities.find((c) => c.id === selectedCity);
                      if (city) {
                        setDistrict(opt);
                        setIsOpen(false);
                        // Trigger server refresh
                        setTimeout(() => router.refresh(), 100);
                      }
                    }
                    setSearchQuery("");
                  }}
                >
                  <div className={styles.optionContent}>
                    {activeTab === "pais" && (
                      <span className={styles.flag}>{opt.flag || "🌍"}</span>
                    )}
                    <span>{opt.name}</span>
                  </div>
                  {((activeTab === "pais" && selectedCountry === opt.id) ||
                    (activeTab === "provincia" &&
                      selectedProvince === opt.id) ||
                    (activeTab === "ciudad" && selectedCity === opt.id) ||
                    (activeTab === "distrito" &&
                      currentDistrict?.id === opt.id)) && <Check size={12} />}
                </div>
              ))
            ) : (
              <div className={styles.empty}>No se encontraron resultados</div>
            )}
          </div>
        </div>

        {/* Radius Selector */}
        <div className={styles.radiusBox}>
          <div className={styles.radiusLabel}>
            Radio de búsqueda personalizado:
          </div>
          <div className={styles.radiusOptions}>
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`${styles.radiusBtn} ${radius === r ? styles.radiusBtnActive : ""}`}
                onClick={() => setRadius(r)}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.dropdownFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Globe size={10} />
            <span>SaidonClub Location Engine v6.0</span>
          </div>
          <span>LatAm Hierarchy</span>
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* Trigger */}
      <div className={styles.container} ref={containerRef}>
        <div
          className={styles.selector}
          onClick={toggle}
          title="Configurar área de búsqueda"
        >
          <div className={styles.pinWrapper}>
            <MapPin size={16} className={styles.icon} />
            {isLoading && <div className={styles.pulse} />}
          </div>
          <div className={styles.locationInfo}>
            <span className={styles.regionLabel}>Marketplace en:</span>
            <span className={styles.cityName}>
              {currentCity
                ? `${currentCity.name}${currentDistrict ? ` - ${currentDistrict.name}` : ""}`
                : "Cargando..."}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
          />
        </div>
      </div>

      {/* Portalizado al body para evitar clipping */}
      {mounted && createPortal(dropdownContent, document.body)}
    </>
  );
};

export default RegionSelector;


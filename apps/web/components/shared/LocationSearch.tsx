/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import styles from './LocationSearch.module.css';
import { useLocation } from '@/context/LocationContext';
import { mapGoogleComponentsToSaidon } from '@/utils/google-maps';

interface LocationSearchProps {
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
  countryCode?: string;
}

export default function LocationSearch({ 
  placeholder = "Busca tu ciudad o sector...", 
  onSelect,
  className = "",
  countryCode = "ec"
}: LocationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const { setLocationFromGoogle, isLoading } = useLocation();

  useEffect(() => {
    if (!(window as any).google || !inputRef.current) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['(regions)'], // Allows provinces, cities, neighborhoods
      componentRestrictions: { country: countryCode }, // Restricted to selected country
      fields: ['address_components', 'geometry', 'formatted_address', 'place_id']
    });

    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const hierarchy = mapGoogleComponentsToSaidon(place);
      const success = await setLocationFromGoogle(hierarchy);
      
      if (success) {
        setSearchValue(place.formatted_address || "");
        if (onSelect) onSelect();
      }
    });

    // Cleanup
    return () => {
      (window as any).google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [setLocationFromGoogle, onSelect]);

  const clearSearch = () => {
    setSearchValue("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper}>
        <MapPin className={styles.icon} size={18} />
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
        />
        {searchValue ? (
          <button type="button" onClick={clearSearch} className={styles.clearButton}>
            <X size={16} />
          </button>
        ) : (
          <Search className={styles.searchIcon} size={18} />
        )}
      </div>
      {isLoading && <div className={styles.loaderLine} />}
    </div>
  );
}


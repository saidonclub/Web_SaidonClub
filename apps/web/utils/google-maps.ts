/**
 * Utility to map Google Maps Address Components to Saidon hierarchical levels.
 */

export interface SaidonGeographicHierarchy {
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  placeId?: string;
}

export function mapGoogleComponentsToSaidon(
  place: Record<string, unknown>
): SaidonGeographicHierarchy {
  const components = (place.address_components as Array<Record<string, unknown>>) || [];
  const geometry = place.geometry as Record<string, unknown>;
  const location = geometry?.location as Record<string, unknown>;
  const result: SaidonGeographicHierarchy = {
    latitude: typeof location?.lat === 'function' ? (location.lat as () => number)() : undefined,
    longitude: typeof location?.lng === 'function' ? (location.lng as () => number)() : undefined,
    formattedAddress: place.formatted_address as string,
    placeId: place.place_id as string,
  };

  (components as Array<Record<string, unknown>>).forEach((component) => {
    const types = component.types as string[];
    const longName = component.long_name as string | undefined;

    if (types.includes("country")) {
      result.country = longName;
    }

    if (types.includes("administrative_area_level_1")) {
      result.province = longName;
    }

    if (types.includes("locality")) {
      result.city = longName;
    } else if (!result.city && types.includes("sublocality")) {
      result.city = longName;
    }

    if (
      types.includes("sublocality_level_1") ||
      types.includes("neighborhood") ||
      types.includes("sublocality")
    ) {
      if (longName !== result.city) {
        result.district = longName;
      }
    }
  });

  return result;
}

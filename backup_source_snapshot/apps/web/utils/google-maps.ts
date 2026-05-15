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
  place: any
): SaidonGeographicHierarchy {
  const components = place.address_components || [];
  const result: SaidonGeographicHierarchy = {
    latitude: place.geometry?.location?.lat(),
    longitude: place.geometry?.location?.lng(),
    formattedAddress: place.formatted_address,
    placeId: place.place_id,
  };

  components.forEach((component: any) => {
    const types = component.types;

    if (types.includes("country")) {
      result.country = component.long_name;
    }

    if (types.includes("administrative_area_level_1")) {
      result.province = component.long_name;
    }

    if (types.includes("locality")) {
      result.city = component.long_name;
    } else if (!result.city && types.includes("sublocality")) {
       // Fallback to sublocality if locality is missing
      result.city = component.long_name;
    }

    if (
      types.includes("sublocality_level_1") ||
      types.includes("neighborhood") ||
      types.includes("sublocality")
    ) {
      // Only set district if it's different from city
      if (component.long_name !== result.city) {
        result.district = component.long_name;
      }
    }
  });

  return result;
}

import { Country, State } from "country-state-city";

let cachedCountryNames = null;

/** All country display names, sorted alphabetically. */
export function getAllCountryNames() {
  if (!cachedCountryNames) {
    cachedCountryNames = Country.getAllCountries()
      .map((c) => c.name)
      .sort((a, b) => a.localeCompare(b));
  }
  return cachedCountryNames;
}

export function findCountryByName(countryName) {
  if (!countryName?.trim()) return null;
  const normalized = countryName.trim().toLowerCase();
  return (
    Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === normalized,
    ) ?? null
  );
}

/** State/province names for a country (by country display name). */
export function getStateNamesByCountryName(countryName) {
  const country = findCountryByName(countryName);
  if (!country) return [];
  try {
    const states = State.getStatesOfCountry(country.isoCode);
    if (!states?.length) return [];
    return states.map((s) => s.name).sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

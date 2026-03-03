/**
 * Country option for phone selector.
 * Static data — no API calls.
 */
export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

/** Default country for phone (Morocco +212) */
export const DEFAULT_COUNTRY_MOROCCO: CountryOption = {
  code: "MA",
  name: "Morocco",
  dialCode: "+212",
  flag: "🇲🇦",
};

const COUNTRIES: CountryOption[] = [
  DEFAULT_COUNTRY_MOROCCO,
  { code: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
].sort((a, b) => {
  if (a.code === "MA") return -1;
  if (b.code === "MA") return 1;
  return a.name.localeCompare(b.name);
});

/** Returns all countries (static list, Morocco first). */
export async function fetchCountries(): Promise<CountryOption[]> {
  return COUNTRIES;
}

import type { CountryOption } from "./countries";

/**
 * Static list of Moroccan cities covering all 12 regions.
 */
const MOROCCO_CITIES: string[] = [
  // Tanger-Tétouan-Al Hoceïma
  "Tangier", "Tetouan", "Al Hoceima", "Larache", "Ksar el-Kebir", "Asilah",
  "Chefchaouen", "Ouezzane", "Fnideq", "M'diq",
  // L'Oriental
  "Oujda", "Nador", "Berkane", "Taourirt", "Jerada", "Figuig", "Driouch", "Guercif",
  // Fès-Meknès
  "Fes", "Meknes", "Taza", "Sefrou", "Ifrane", "Azrou", "Moulay Yacoub",
  "El Hajeb", "Missour", "Boulemane", "Imouzzer Kandar",
  // Rabat-Salé-Kénitra
  "Rabat", "Salé", "Kenitra", "Temara", "Skhirat", "Khemisset",
  "Sidi Kacem", "Sidi Slimane", "Tiflet", "Harhoura",
  // Béni Mellal-Khénifra
  "Beni Mellal", "Khouribga", "Fquih Ben Salah", "Azilal", "Khenifra",
  "Kasba Tadla", "Oued Zem",
  // Casablanca-Settat
  "Casablanca", "Mohammedia", "El Jadida", "Settat", "Berrechid",
  "Benslimane", "Azemmour", "Sidi Bennour", "Mediouna", "Nouaceur",
  "Ain Harrouda", "Bouznika",
  // Marrakech-Safi
  "Marrakech", "Safi", "Essaouira", "El Kelaa des Sraghna", "Youssoufia",
  "Chichaoua", "Ben Guerir", "Rehamna",
  // Drâa-Tafilalet
  "Errachidia", "Ouarzazate", "Tinghir", "Zagora", "Midelt", "Goulmima",
  "Rissani", "Merzouga",
  // Souss-Massa
  "Agadir", "Inezgane", "Ait Melloul", "Tiznit", "Taroudant",
  "Chtouka Ait Baha", "Tata",
  // Guelmim-Oued Noun
  "Guelmim", "Tan-Tan", "Sidi Ifni", "Assa-Zag",
  // Laâyoune-Sakia El Hamra
  "Laayoune", "Boujdour", "Es-Semara", "Tarfaya",
  // Dakhla-Oued Ed-Dahab
  "Dakhla", "Aousserd",
].sort((a, b) => a.localeCompare(b));

/** Returns cities for the given country (only Morocco is supported). */
export async function fetchCities(country: CountryOption | null): Promise<string[]> {
  if (!country?.name) return [];
  if (country.code === "MA") return MOROCCO_CITIES;
  return [];
}


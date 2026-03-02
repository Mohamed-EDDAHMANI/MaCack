// Align with auth-service: User + Client | Patissiere | Livreur
export type RegisterRole = "CLIENT" | "PATISSIERE" | "LIVREUR";

export type RegisterStep = 1 | 2;

export interface RegisterFormData {
  // User (base)
  name: string;
  email: string;
  password: string;
  phone: string;
  photo: string | null;
  city: string;
  address: string;
  description: string;
  // Role-specific (Patissiere)
  bio?: string;
  // Role-specific (Livreur)
  vehicleType?: string;
}

export const DEFAULT_FORM_DATA: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  phone: "",
  photo: null,
  city: "",
  address: "",
  description: "",
  bio: "",
  vehicleType: "",
};

export const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Lille", "Casablanca", "Rabat", "Fes"];

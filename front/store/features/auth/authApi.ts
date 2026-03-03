import { Platform } from "react-native";
import { File as ExpoFile } from "expo-file-system";
import { api } from "@/lib/axios";
import type {
  AuthApiResponse,
  AuthResponseData,
  UserRole,
} from "./authSlice";

const LOGIN_PATH = "/s1/auth/login";
const REGISTER_PATH = "/s1/auth/register";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  photo?: string | null;
  city?: string;
  address?: string;
  description?: string;
  role?: UserRole;
  status?: "active" | "suspended";
}

/**
 * Convert a local file URI (from expo-image-picker) to a base64 string.
 * Returns null if the URI is empty or conversion fails.
 */
async function fileUriToBase64(uri: string): Promise<string | null> {
  try {
    if (!uri) return null;
    // On web the URI is already a data: or blob URL – send as-is
    if (Platform.OS === "web") return uri;
    const file = new ExpoFile(uri);
    const buffer = await file.arrayBuffer();
    // Convert ArrayBuffer → base64 without btoa (works on Hermes)
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return globalThis.btoa(binary);
  } catch (err) {
    console.warn("[authApi] Failed to convert photo to base64:", err);
    return null;
  }
}

/** Guess MIME type from local URI extension */
function guessMimeType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return map[ext ?? ""] || "image/jpeg";
}

export async function login(
  payload: LoginPayload,
): Promise<AuthApiResponse<AuthResponseData>> {
  const res = await api.post<AuthApiResponse<AuthResponseData>>(
    LOGIN_PATH,
    payload,
  );
  return res.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthApiResponse<AuthResponseData>> {
  // If a local photo URI was provided, convert it to base64 so the
  // auth-service can upload it to MinIO during registration.
  let photoBase64: string | null = null;
  let photoMimetype: string | undefined;
  let photoFilename: string | undefined;

  if (payload.photo && !payload.photo.startsWith("http")) {
    photoBase64 = await fileUriToBase64(payload.photo);
    photoMimetype = guessMimeType(payload.photo);
    photoFilename = payload.photo.split("/").pop() || undefined;
  }

  const body = {
    ...payload,
    // Replace the local URI with the base64 data
    photo: photoBase64,
    photoMimetype,
    photoFilename,
  };

  const res = await api.post<AuthApiResponse<AuthResponseData>>(
    REGISTER_PATH,
    body,
  );
  return res.data;
}

import axios from "axios";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const authApi = axios.create({ baseURL: BASE_URL });

// Attach JWT on every request if present
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("netflix_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to /login on 401
authApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("netflix_token");
      localStorage.removeItem("netflix_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await authApi.post<AuthResponse>("/api/auth/login", credentials);
  return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<{ message: string }> {
  const { data } = await authApi.post<{ message: string }>("/api/auth/register", credentials);
  return data;
}

export async function fetchProfile(): Promise<{ user: import("@/types/auth").User }> {
  const { data } = await authApi.get("/api/auth/profile");
  return data;
}

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "@/api/auth";
import type { User, LoginCredentials, RegisterCredentials } from "@/types/auth";

function loadStoredAuth(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem("netflix_token");
    const raw = localStorage.getItem("netflix_user");
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function useAuth() {
  const navigate = useNavigate();
  const stored = loadStoredAuth();

  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await loginUser(credentials);
        localStorage.setItem("netflix_token", res.token);
        localStorage.setItem("netflix_user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/");
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "Login failed. Please try again.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        await registerUser(credentials);
        navigate("/login");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "Registration failed. Please try again.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("netflix_token");
    localStorage.removeItem("netflix_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };
}

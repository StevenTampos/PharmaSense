import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "pharmasense_auth_token";
const USER_KEY = "pharmasense_auth_user";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota or access errors in sandbox/private mode
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
}

export function clearStoredSession(): void {
  setStoredToken(null);
  setStoredUser(null);
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "";

/**
 * Standardized fetch wrapper that includes credentials, headers, and token.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T> & { isNetworkError?: boolean }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedUrl = endpoint.startsWith("http")
    ? endpoint
    : `${apiBaseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(normalizedUrl, {
      ...options,
      headers,
    });

    const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

    if (!response.ok || !body) {
      return {
        status: "error",
        data: null,
        message: body?.message || `Request failed with status ${response.status}`,
      };
    }

    return body;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Network error. Backend unreachable.";
    return {
      status: "error",
      data: null,
      message,
      isNetworkError: true,
    };
  }
}

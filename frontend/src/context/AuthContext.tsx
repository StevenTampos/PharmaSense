import { createContext, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { login as authenticate, logout as authLogout } from "@/services/authService";
import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<ApiResponse<AuthUser>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides in-memory authentication state to the application.
 *
 * @param props - Provider children.
 * @returns The authentication context provider.
 */
export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);

  async function login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
    const response = await authenticate(email, password);

    if (response.status === "success" && response.data) {
      setUser(response.data);
    }

    return response;
  }

  function logout(): void {
    void authLogout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

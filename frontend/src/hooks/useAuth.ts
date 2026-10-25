import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { AuthContextValue } from "@/context/AuthContext";

/**
 * Reads the current authentication state and actions.
 *
 * @returns The current authentication context value.
 * @throws An error when called outside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return authContext;
}

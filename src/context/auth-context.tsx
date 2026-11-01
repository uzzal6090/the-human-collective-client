"use client";

import React, { createContext, useContext, useEffect, type ReactNode } from "react";
import { authClient } from "@/src/lib/auth-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
    photoURL?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  // Handle OAuth redirect carrying session_token query param for robust cross-domain authentication
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("session_token");

      if (token) {
        // 1. Store in localStorage for Authorization: Bearer headers
        localStorage.setItem("session_token", token);

        // 2. Set client-side cookies for first-party persistence
        const isHttps = window.location.protocol === "https:";
        const secureFlag = isHttps ? "; Secure" : "";
        document.cookie = `better-auth.session_token=${token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
        if (isHttps) {
          document.cookie = `__Secure-better-auth.session_token=${token}; Path=/; Max-Age=604800; SameSite=Lax; Secure`;
        }

        // 3. Clean query parameter from address bar
        url.searchParams.delete("session_token");
        window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));

        // 4. Immediately trigger session hydration
        refetch();
      }
    } catch (err) {
      console.warn("Session token sync error:", err);
    }
  }, [refetch]);

  // Directly derive user from sessionData (React 19 compiler automatically optimizes this)
  const user: AuthUser | null = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name || "Community Member",
        email: sessionData.user.email,
        image: sessionData.user.image || undefined,
      }
    : null;

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message || "Failed to sign in. Please verify your credentials.",
        };
      }

      await refetch();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during login.";
      return {
        success: false,
        error: message,
      };
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    photoURL?: string
  ) => {
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL || undefined,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message || "Failed to create account. Please try again.",
        };
      }

      await refetch();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during registration.";
      return {
        success: false,
        error: message,
      };
    }
  };

  const signOutUser = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("session_token");
        document.cookie = "better-auth.session_token=; Path=/; Max-Age=0;";
        document.cookie = "__Secure-better-auth.session_token=; Path=/; Max-Age=0; Secure;";
      }
      await authClient.signOut();
      await refetch();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const refreshSession = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

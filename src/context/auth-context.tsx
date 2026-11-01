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

const BASE_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://the-human-collective-client.vercel.app"
    : "http://localhost:3000");

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  // Fetch the JWT from /api/auth/token and persist it to localStorage so api.ts
  // can send it as Bearer token to Express APIs
  useEffect(() => {
    let cancelled = false;

    const fetchJwt = async () => {
      const sessionToken = sessionData?.session?.token;
      if (!sessionToken || cancelled) return;

      try {
        const res = await fetch(`${BASE_URL}/api/auth/token`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token && typeof window !== "undefined") {
            localStorage.setItem("session_token", data.token);
          }
        }
      } catch {
        // Ignore JWT fetch errors; session token remains in cookies
      }
    };

    fetchJwt();
    return () => { cancelled = true; };
  }, [sessionData?.session?.token]);

  // Handle OAuth redirect carrying session_token query param for robust cross-domain authentication
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("session_token");

      if (token) {
        localStorage.setItem("session_token", token);

        const isHttps = window.location.protocol === "https:";
        const secureFlag = isHttps ? "; Secure" : "";
        document.cookie = `better-auth.session_token=${token}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
        if (isHttps) {
          document.cookie = `__Secure-better-auth.session_token=${token}; Path=/; Max-Age=604800; SameSite=Lax; Secure`;
        }

        url.searchParams.delete("session_token");
        window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));

        refetch();
      }
    } catch (err) {
      console.warn("Session token sync error:", err);
    }
  }, [refetch]);

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

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://the-human-collective-server.vercel.app"
      : "http://localhost:5000"),
  fetchOptions: {
    credentials: "include",
    auth: {
      type: "Bearer",
      token: () => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("session_token") || "";
        }
        return "";
      },
    },
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
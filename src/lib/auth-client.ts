import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://the-human-collective-client.vercel.app"
      : "http://localhost:3000"),
  fetchOptions: {
    credentials: "include",
  },
  plugins: [jwtClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins/jwt";
import { nextCookies } from "better-auth/next-js";
import dns from "node:dns";
import { MongoClient } from "mongodb";

// Ensure MongoDB Atlas SRV records resolve in this environment
dns.setServers(["8.8.8.8"]);

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

export const mongoClient = new MongoClient(mongoUri);

export const database = mongoClient.db("the-human-collective");

const socialProviders: Record<string, any> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    prompt: "select_account",
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",

  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    "https://the-human-collective-client.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders,

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  plugins: [jwt(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

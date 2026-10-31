"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import { authClient } from "@/src/lib/auth-client";

export default function LoginPage() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signInWithEmail(email.trim(), password);

      if (result.success) {
        toast.success("Welcome back! Signed in successfully.");
        router.push("/");
      } else {
        toast.error(result.error || "Invalid email or password.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch {
      toast.error(
        "Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured in server .env. Please use Email/Password sign-in."
      );
    }
  }

  // Examiner helper for one-click demo login
  function fillDemoAccount() {
    setEmail("sarah.rahman@example.com");
    setPassword("Community#2026");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-button-primary text-xl font-bold text-white shadow-sm">
            H
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              The Human Collective
            </p>
            <p className="text-xs text-muted">
              Together for change
            </p>
          </div>
        </Link>

        {/* Login Card */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Welcome Back
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Continue making a meaningful difference in your community.
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-surface"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z"
              />
              <path
                fill="#EA4335"
                d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 pr-20 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-accent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-button-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-button-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo account quick fill button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted transition hover:border-primary hover:text-primary"
            >
              💡 Click to prefill demo credentials
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-accent transition hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          By continuing, you agree to our community guidelines.
        </p>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-primary transition hover:text-accent"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
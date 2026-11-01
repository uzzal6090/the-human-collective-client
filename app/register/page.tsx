"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import { authClient } from "@/src/lib/auth-client";

export default function RegisterPage() {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  async function handleGoogleLogin() {
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });

      if (res?.error) {
        toast.error(
          "Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured in Google Cloud & server .env."
        );
      }
    } catch {
      toast.error(
        "Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured in Google Cloud & server .env."
      );
    }
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Assignment-required password validation (PDF Page 3)
    const hasMinimumLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (!hasMinimumLength) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUpWithEmail(
        name.trim(),
        email.trim(),
        password,
        photoURL.trim() || undefined
      );

      if (result.success) {
        toast.success("Account created successfully! Welcome to The Human Collective.");
        router.push("/");
      } else {
        toast.error(result.error || "Failed to create account. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Register Card */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
          <div className="mb-7 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Join Our Community
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Be part of something meaningful. Connect with people and create
              positive change together.
            </p>
          </div>

          {/* Google Signup */}
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
              OR REGISTER WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Full Name <span className="text-accent">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                minLength={2}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email Address <span className="text-accent">*</span>
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

            {/* Photo URL */}
            <div>
              <label
                htmlFor="photoURL"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Profile Photo URL
              </label>

              <input
                id="photoURL"
                name="photoURL"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1 text-xs text-muted">
                Public image URL for your profile avatar
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Password <span className="text-accent">*</span>
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
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

              <p className="mt-2 text-xs leading-5 text-muted">
                Must have at least 6 characters, including 1 uppercase and 1 lowercase letter.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-button-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-button-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-accent transition hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
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
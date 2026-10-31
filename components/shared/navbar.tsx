"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import { useTheme } from "@/src/context/theme-context";

export default function Navbar() {
  const { user, isLoading, signOutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out successfully");
      closeMobileMenu();
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors duration-200">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-button-primary text-lg font-bold text-white shadow-sm">
            H
          </div>

          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              The Human Collective
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
              Together for change
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/upcoming-events"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Upcoming Events
          </Link>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-surface-secondary hover:shadow-sm"
          >
            {theme === "dark" ? (
              /* Sun Icon for Light Mode */
              <svg
                className="h-5 w-5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              /* Moon Icon for Dark Mode */
              <svg
                className="h-5 w-5 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-surface-secondary border border-border" />
          ) : !user ? (
            <Link
              href="/login"
              className="rounded-full bg-button-primary px-7 py-2.5 text-sm font-semibold text-white transition-all hover:bg-button-primary-hover hover:text-white hover:shadow-md"
            >
              Login
            </Link>
          ) : (
            <div className="group relative">
              {/* Profile Button */}
              <button
                type="button"
                title={user.name}
                aria-label={`Profile menu for ${user.name}`}
                className="flex items-center gap-2.5 rounded-full border border-border bg-surface p-1.5 transition-colors hover:bg-surface-secondary"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-button-primary text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-[120px] truncate pr-1 text-xs font-semibold text-foreground">
                  {user.name}
                </span>

                <span className="pr-1 text-xs text-muted">⌄</span>
              </button>

              {/* Profile Dropdown */}
              <div className="invisible absolute right-0 top-full z-50 w-60 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl">
                  {/* User Information */}
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user.email}
                    </p>
                  </div>

                  {/* Dashboard Links (PDF Page 2) */}
                  <div className="space-y-1 py-2">
                    <Link
                      href="/create-event"
                      className="block rounded-lg px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Create Event
                    </Link>
                    <Link
                      href="/manage-events"
                      className="block rounded-lg px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Manage Events
                    </Link>
                    <Link
                      href="/joined-events"
                      className="block rounded-lg px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Joined Events
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-surface-secondary"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-secondary"
          >
            {theme === "dark" ? (
              <span className="text-amber-400">☀️</span>
            ) : (
              <span className="text-slate-700">🌙</span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-secondary"
          >
            <span className="text-2xl leading-none">{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/upcoming-events"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
            >
              Upcoming Events
            </Link>

            {isLoading ? (
              <div className="h-10 animate-pulse rounded-xl bg-surface-secondary" />
            ) : !user ? (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="mt-2 rounded-full bg-button-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-button-primary-hover"
              >
                Login
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-button-primary font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/create-event"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Create Event
                </Link>

                <Link
                  href="/manage-events"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Manage Events
                </Link>

                <Link
                  href="/joined-events"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Joined Events
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-accent transition-colors hover:bg-surface-secondary"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

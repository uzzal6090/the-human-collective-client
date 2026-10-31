"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import { useTheme } from "@/src/context/theme-context";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
  { href: "/profile", label: "My Profile" },
];

function navIcon(label: string) {
  switch (label) {
    case "Create Event":
      return (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "Manage Events":
      return (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "Joined Events":
      return (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "My Profile":
      return (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, signOutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Protected route guard: Ensures logged-in users aren't redirected on reload
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please sign in to access your dashboard.");
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Safe loading skeleton on initial page reload (prevents premature redirects)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated and finished loading, show brief redirecting state
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm font-medium text-muted">Redirecting to login...</p>
      </div>
    );
  }

  const isActive = (href: string) => pathname === href;

  const sidebarLinks = NAV_ITEMS.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        isActive(item.href)
          ? "bg-button-primary text-white shadow-sm"
          : "text-foreground/80 hover:bg-surface-secondary hover:text-primary"
      }`}
    >
      {navIcon(item.label)}
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-surface shadow-sm lg:flex">
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-button-primary text-lg font-bold text-white shadow-sm">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground">
                The Human Collective
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Card */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-button-primary text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {sidebarLinks}

          <div className="pt-4">
            <Link
              href="/upcoming-events"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-secondary hover:text-primary"
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Explore Events</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-secondary hover:text-primary"
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Website</span>
            </Link>
          </div>
        </nav>

        {/* Theme Switcher & Logout */}
        <div className="space-y-2 border-t border-border p-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/80 transition-colors hover:bg-surface-secondary"
          >
            <span>Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-accent transition-colors hover:bg-surface-secondary"
          >
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-button-primary text-lg font-bold text-white shadow-sm">
              H
            </div>
            <span className="font-bold tracking-tight text-foreground">
              Dashboard
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-secondary"
            aria-label="Close menu"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-button-primary text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {sidebarLinks}
          <div className="pt-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-surface-secondary"
            >
              <span>← Back to Website</span>
            </Link>
          </div>
        </nav>

        <div className="space-y-2 border-t border-border p-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/80 hover:bg-surface-secondary"
          >
            <span>Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-surface-secondary"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface-secondary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="text-sm font-bold text-foreground">
            The Human Collective
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

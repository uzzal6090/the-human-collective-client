
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavbarUser = {
  name: string;
  email: string;
  image?: string;
};

type NavbarProps = {
  user?: NavbarUser | null;
  onLogout?: () => void;
};

export default function Navbar({
  user = null,
  onLogout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-button-primary text-lg font-bold text-white">
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
        <div className="hidden items-center gap-9 md:flex">

          <Link
            href="/upcoming-events"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Upcoming Events
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="rounded-full bg-button-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-button-primary-hover hover:text-white hover:shadow-lg"
            >
              Login
            </Link>
          ) : (
            <div className="group relative">

              {/* Profile Button */}
              <button
                type="button"
                title={user.name}
                aria-label={`Open profile menu for ${user.name}`}
                className="flex items-center gap-3 rounded-full border border-border p-1.5 transition-colors hover:bg-surface-secondary"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-button-primary text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="pr-2 text-xs font-semibold text-foreground">
                  {user.name}
                </span>

                <span className="pr-2 text-xs text-muted">
                  ⌄
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="invisible absolute right-0 top-full z-50 w-60 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">

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

                  {/* Dashboard Links */}
                  <div className="space-y-1 py-2">
                    <Link
                      href="/create-event"
                      className="block rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      className="block rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      className="block rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      Joined Events
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border pt-2">
                    <button
                      type="button"
                      onClick={onLogout}
                      disabled={!onLogout}
                      className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-accent transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Logout
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-secondary md:hidden"
        >
          <span className="text-2xl">
            {mobileOpen ? "×" : "☰"}
          </span>
        </button>
      </nav>

      {/* Mobile Navigation */}
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

            {!user ? (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="mt-2 rounded-full bg-button-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-button-primary-hover hover:text-white"
              >
                Login
              </Link>
            ) : (
              <>

                {/* Mobile User Information */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">

                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
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

                {/* Mobile Dashboard Links */}
                <Link
                  href="/create-event"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Create Event
                </Link>

                <Link
                  href="/manage-events"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Manage Events
                </Link>

                <Link
                  href="/joined-events"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-surface-secondary"
                >
                  Joined Events
                </Link>

                {/* Mobile Logout */}
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={!onLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-accent transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
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

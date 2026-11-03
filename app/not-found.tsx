"use client";

import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background transition-colors duration-200">
        <section className="flex min-h-[60vh] items-center justify-center px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="inline-flex items-center justify-center rounded-full bg-accent/10 px-4 py-2 mb-8"
            >
              <span className="text-4xl font-bold text-accent">404</span>
            </div>

            <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Oops! Page Not Found
            </h1>

            <p className="mb-10 max-w-md mx-auto text-sm leading-6 text-muted sm:text-base">
              The page you&rsquo;re looking for doesn&rsquo;t exist. It may have been moved or removed.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-button-primary-hover hover:text-white hover:shadow-lg"
            >
              &larr; Back to Home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

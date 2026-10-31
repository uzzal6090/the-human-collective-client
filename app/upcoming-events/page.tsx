"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import EventCard from "@/components/events/event-card";
import { getAllEvents, type EventItem } from "@/src/lib/api";

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    getAllEvents(searchTerm, selectedCategory)
      .then((data) => {
        if (isMounted) {
          setEvents(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      setSelectedCategory(value);
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background transition-colors duration-200">
        {/* Page Hero Header */}
        <section className="border-b border-border bg-surface-secondary px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Be Part of the Change
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Upcoming Events
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Discover meaningful community events, connect with passionate volunteers,
              and take part in creating positive, lasting social change.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Search, Filter & Action Bar */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Explore Events
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {isLoading
                    ? "Searching upcoming community activities..."
                    : `Showing ${events.length} upcoming ${events.length === 1 ? "event" : "events"}`}
                </p>
              </div>

              <Link
                href="/create-event"
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-button-primary-hover hover:text-white sm:self-auto"
              >
                <span>+</span> Create an Event
              </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by event title, location, or keywords..."
                  aria-label="Search events"
                  className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  aria-label="Filter events by category"
                  className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="all">All Event Categories</option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Community Support">Community Support</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Event Grid / Loading Skeletons / Empty State */}
            <div className="mt-10">
              {isLoading ? (
                /* Loading Skeleton Grid (PDF Optional #1) */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="flex h-[360px] animate-pulse flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-4"
                    >
                      <div className="aspect-[16/10] w-full rounded-xl bg-surface-secondary" />
                      <div className="space-y-3 pt-4">
                        <div className="h-5 w-3/4 rounded-lg bg-surface-secondary" />
                        <div className="h-4 w-1/2 rounded-lg bg-surface-secondary" />
                        <div className="h-4 w-1/3 rounded-lg bg-surface-secondary" />
                      </div>
                      <div className="mt-4 h-10 w-full rounded-full bg-surface-secondary" />
                    </div>
                  ))}
                </div>
              ) : events.length > 0 ? (
                /* Dynamic Event Cards */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                    🌱
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-foreground sm:text-2xl">
                    No Upcoming Events Found
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                    {searchTerm || selectedCategory !== "all"
                      ? "No events matched your current search filters. Try clearing your filters to see more events."
                      : "There are currently no upcoming events scheduled. Be the first to start a social impact event in your community!"}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                    {searchTerm || selectedCategory !== "all" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        }}
                        className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
                      >
                        Clear Filters
                      </button>
                    ) : null}

                    <Link
                      href="/create-event"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-button-primary-hover hover:text-white hover:shadow-md"
                    >
                      Create an Event
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

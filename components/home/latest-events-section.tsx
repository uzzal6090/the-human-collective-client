"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/events/event-card";
import { getRecentEvents, type EventItem, type FetchEventsError } from "@/src/lib/api";

type LatestEventsSectionProps = {
  initialEvents?: EventItem[];
};

export default function LatestEventsSection({
  initialEvents = [],
}: LatestEventsSectionProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [error, setError] = useState<FetchEventsError | null>(null);
  const [isLoading, setIsLoading] = useState(initialEvents.length === 0);

  const fetchRecentEvents = async () => {
    try {
      const result = await getRecentEvents();
      if (result.error) {
        setError(result.error);
        setEvents([]);
      } else {
        setEvents(result.data ?? []);
        setError(null);
      }
    } catch (err) {
      console.error("Error loading recent events:", err);
      setError({
        type: "network",
        message: "Unexpected error loading recent events.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchRecentEvents();
  };

  useEffect(() => {
    let isMounted = true;

    // Fetch 6 recent upcoming events directly from MongoDB (PDF Requirement Page 3)
    fetchRecentEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-surface-secondary/50 px-5 py-16 transition-colors duration-300 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Make a Difference
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Latest Upcoming Events
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Discover recently created social service opportunities in your local area and join forces with fellow community members.
            </p>
          </div>

          {/* View All Events Button */}
          <Link
            href="/upcoming-events"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-md"
          >
            View all events
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Content: Skeletons / Dynamic Cards / Empty State */}
        {isLoading ? (
          /* Loading Skeletons (PDF Optional Task #1) */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex h-[360px] animate-pulse flex-col justify-between rounded-2xl border border-border bg-surface p-4"
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
        ) : error ? (
          /* Error State */
          <div className="rounded-3xl border border-dashed border-border bg-surface px-5 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl text-red-500">
              ⚠️
            </div>

            <h3 className="mt-6 text-xl font-bold text-foreground">
              Failed to Load Events
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              {error.message}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-button-primary-hover hover:text-white hover:shadow-md"
            >
              Retry
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : events.length > 0 ? (
          /* Dynamic Event Cards in 2/3 Column Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-border bg-surface px-5 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary">
              🌱
            </div>

            <h3 className="mt-6 text-xl font-bold text-foreground">
              No upcoming events yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              New community events will appear here as soon as they are created. Be the first to create one!
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-md"
            >
              Create First Event
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

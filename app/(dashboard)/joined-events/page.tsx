"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJoinedEventsApi, type JoinedEventItem } from "@/src/lib/api";

export default function JoinedEventsPage() {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getMyJoinedEventsApi()
      .then((data) => {
        if (isMounted) {
          setJoinedEvents(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching joined events:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Volunteer Activity
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Joined Events
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Events you have registered to attend, organized chronologically by event date so you never miss an initiative.
              </p>
            </div>

            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 self-start rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-button-primary-hover hover:text-white sm:self-auto"
            >
              <span>+</span> Explore More Events
            </Link>
          </div>
        </div>
      </section>

      {/* Events List Section */}
      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex h-24 animate-pulse items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="h-16 w-24 rounded-xl bg-surface-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/3 rounded-lg bg-surface-secondary" />
                    <div className="h-4 w-1/4 rounded-lg bg-surface-secondary" />
                  </div>
                  <div className="h-10 w-28 rounded-xl bg-surface-secondary" />
                </div>
              ))}
            </div>
          ) : joinedEvents.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                🤝
              </div>

              <h3 className="mt-6 text-xl font-bold text-foreground sm:text-2xl">
                No Joined Events Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                You haven&apos;t joined any events yet. Browse upcoming initiatives in your area and take part in something meaningful.
              </p>

              <Link
                href="/upcoming-events"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-button-primary-hover hover:text-white"
              >
                Explore Upcoming Events
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            /* Events List Sorted by Date (PDF Requirement Page 5) */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <p className="text-sm font-bold text-foreground">
                  Events You Are Attending ({joinedEvents.length})
                </p>
                <span className="text-xs text-muted">
                  Sorted by date (chronological)
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
                <div className="divide-y divide-border">
                  {joinedEvents.map((item) => {
                    const eventDate = new Date(item.eventDate);
                    const formattedDate = !Number.isNaN(eventDate.getTime())
                      ? eventDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : item.eventDate;

                    const joinedDate = item.joinedAt
                      ? new Date(item.joinedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "";

                    return (
                      <div
                        key={item._id}
                        className="flex flex-col gap-4 p-5 transition-colors hover:bg-surface-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      >
                        {/* Event Thumbnail & Info */}
                        <div className="flex items-start gap-4">
                          <div
                            className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-secondary bg-cover bg-center"
                            style={
                              item.thumbnailUrl
                                ? { backgroundImage: `url("${item.thumbnailUrl}")` }
                                : undefined
                            }
                          >
                            {!item.thumbnailUrl && (
                              <div className="flex h-full items-center justify-center text-xs text-muted">
                                🌱
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {item.eventType}
                            </span>

                            <h3 className="mt-1 line-clamp-1 text-base font-bold text-foreground">
                              {item.eventTitle}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                📍 {item.location}
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-foreground">
                                📅 {formattedDate}
                              </span>
                              {joinedDate && (
                                <span className="text-[11px] text-muted">
                                  (Joined on {joinedDate})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="self-end sm:self-center">
                          <Link
                            href={`/upcoming-events/${item.eventId}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-button-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-button-primary-hover hover:text-white hover:shadow-sm"
                          >
                            <span>View Details</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

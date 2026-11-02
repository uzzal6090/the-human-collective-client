"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { useAuth } from "@/src/context/auth-context";
import { getEventById, joinEventApi, getMyJoinedEventsApi, type EventItem } from "@/src/lib/api";

function EventDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    getEventById(id)
      .then((data) => {
        if (isMounted) {
          setEvent(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load event:", err);
        if (isMounted) setIsLoading(false);
      });

    // If user is logged in, check if already joined
    if (user?.email) {
      getMyJoinedEventsApi().then((joinedList) => {
        if (isMounted) {
          const joined = joinedList.some((j) => j.eventId === id);
          setHasJoined(joined);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, user?.email]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast("Please sign in to join this community event.", { icon: "🔒" });
      router.push(`/login?callbackUrl=${encodeURIComponent(`/upcoming-events/${id}`)}`);
      return;
    }

    if (hasJoined) {
      toast("You are already registered for this event!");
      return;
    }

    setIsJoining(true);

    try {
      const res = await joinEventApi(id);
      if (res.success) {
        setHasJoined(true);
        toast.success("Congratulations! You have joined this event.");
      } else {
        toast.error(res.message || "Failed to join event.");
      }
    } catch {
      toast.error("An error occurred while joining the event.");
    } finally {
      setIsJoining(false);
    }
  };

  const isOrganizer = user?.email && event?.creatorEmail === user.email;

  const eventDate = event?.date ? new Date(event.date) : null;
  const formattedDate =
    eventDate && !Number.isNaN(eventDate.getTime())
      ? eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : event?.date || "Date to be announced";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background transition-colors duration-200">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-border bg-surface px-5 py-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
            >
              <span aria-hidden="true">←</span>
              Back to Upcoming Events
            </Link>
          </div>
        </div>

        {/* Event Content */}
        <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            {isLoading ? (
              /* Loading Skeleton (PDF Optional #1) */
              <div className="animate-pulse space-y-8">
                <div className="aspect-[21/9] w-full rounded-3xl bg-surface-secondary" />
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
                  <div className="space-y-4">
                    <div className="h-6 w-32 rounded-full bg-surface-secondary" />
                    <div className="h-10 w-3/4 rounded-xl bg-surface-secondary" />
                    <div className="h-40 w-full rounded-2xl bg-surface-secondary" />
                  </div>
                  <div className="h-64 w-full rounded-3xl bg-surface-secondary" />
                </div>
              </div>
            ) : !event ? (
              /* Not Found State */
              <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-20 text-center">
                <span className="text-4xl">🔍</span>
                <h1 className="mt-4 text-2xl font-bold text-foreground">
                  Event Not Found
                </h1>
                <p className="mt-2 text-sm text-muted">
                  The event you are looking for might have been removed or does not exist.
                </p>
                <Link
                  href="/upcoming-events"
                  className="mt-6 inline-flex rounded-full bg-button-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-button-primary-hover"
                >
                  Explore Other Events
                </Link>
              </div>
            ) : (
              /* Live Event Details */
              <div>
                {/* Event Hero Cover Image */}
                <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-border bg-surface-secondary shadow-md sm:aspect-[21/9]">
                  {event.thumbnailUrl ? (
                    <img
                      src={event.thumbnailUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🌱
                    </div>
                  )}

                  {event.thumbnailUrl && imageLoadError && (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🌱
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute left-5 top-5 rounded-full bg-background/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md shadow-sm">
                    {event.eventType}
                  </span>
                </div>

                {/* Main Event Grid */}
                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
                  <div>
                    {/* Event Title */}
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {event.title}
                    </h1>

                    {/* Organizer Info */}
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-button-primary text-sm font-bold text-white">
                        {event.creatorName?.charAt(0).toUpperCase() || "O"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Organized by
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {event.creatorName}
                        </p>
                        <p className="text-xs text-muted">
                          {event.creatorEmail}
                        </p>
                      </div>
                    </div>

                    {/* About Event */}
                    <div className="mt-9">
                      <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                        About This Event
                      </h2>
                      <p className="mt-4 whitespace-pre-line text-sm leading-8 text-foreground/80 sm:text-base">
                        {event.description}
                      </p>
                    </div>

                    {/* Key Details Cards */}
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-foreground">
                        Location & Date Details
                      </h2>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Location */}
                        <div className="rounded-2xl border border-border bg-surface p-5">
                          <div className="flex items-center gap-2 text-accent">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                              <circle cx="12" cy="10" r="2.5" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">
                              Location
                            </span>
                          </div>
                          <p className="mt-2 text-base font-semibold text-foreground">
                            {event.location}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="rounded-2xl border border-border bg-surface p-5">
                          <div className="flex items-center gap-2 text-accent">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="5" width="18" height="16" rx="2" />
                              <path d="M16 3v4M8 3v4M3 10h18" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">
                              Scheduled Date
                            </span>
                          </div>
                          <p className="mt-2 text-base font-semibold text-foreground">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join Event Action Box (PDF Requirement Page 4) */}
                  <aside>
                    <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg lg:sticky lg:top-28">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Community Action
                      </span>

                      <h2 className="mt-3 text-xl font-bold text-foreground">
                        Be Part of This Movement
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted">
                        Join fellow volunteers and community members to make a direct positive difference.
                      </p>

                      {/* Join / Action Status */}
                      <div className="mt-6 border-t border-border pt-6">
                        {isOrganizer ? (
                          <div className="rounded-2xl bg-primary/10 p-4 text-center">
                            <p className="text-sm font-semibold text-primary">
                              👑 You are the Organizer
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              You can manage or edit this event from your dashboard.
                            </p>
                            <Link
                              href="/manage-events"
                              className="mt-3 inline-block rounded-xl bg-button-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-button-primary-hover"
                            >
                              Go to Manage Events
                            </Link>
                          </div>
                        ) : hasJoined ? (
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                              ✓ You have joined this event!
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              This event is saved to your Joined Events dashboard.
                            </p>
                            <Link
                              href="/joined-events"
                              className="mt-3 inline-block text-xs font-semibold text-accent underline"
                            >
                              View your joined events →
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleJoinEvent}
                            disabled={isJoining}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-button-accent px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-button-accent-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isJoining ? (
                              <span>Registering you...</span>
                            ) : !user ? (
                              <span>Sign in to Join Event</span>
                            ) : (
                              <span>Join Event Now</span>
                            )}
                            <span aria-hidden="true">🤝</span>
                          </button>
                        )}

                        <p className="mt-4 text-center text-xs text-muted">
                          {!user
                            ? "Public event details page. Logging in is required to join."
                            : "Your participation will be saved in your dashboard."}
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}

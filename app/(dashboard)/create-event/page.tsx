"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import { createEventApi } from "@/src/lib/api";

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateEventPage() {
  const { user, isJwtReady, jwtError, refetchJwt, sessionToken } = useAuth();
  const router = useRouter();

  const [minDate] = useState(() => getTomorrowDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingJwt, setIsFetchingJwt] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !eventType || !thumbnailUrl.trim() || !location.trim() || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validation: Date must be in the future (PDF Page 4)
    const earliestAllowedDate = getTomorrowDate();
    if (date < earliestAllowedDate) {
      toast.error("Please select a future date. Today's and past dates are not allowed.");
      return;
    }

    setIsSubmitting(true);

    // Ensure a valid JWT is available before calling the protected API
    if (!isJwtReady && !sessionToken) {
      setIsFetchingJwt(true);
      try {
        await refetchJwt();
      } catch {
        // refetchJwt handles its own error state via jwtError
      } finally {
        setIsFetchingJwt(false);
      }
    }

    if (!isJwtReady && !sessionToken) {
      setIsSubmitting(false);
      toast.error(jwtError || "Authentication token is not available. Please sign in again.");
      return;
    }

    try {
      const res = await createEventApi({
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnailUrl: thumbnailUrl.trim(),
        location: location.trim(),
        date,
      });

      if (res.success) {
        toast.success("Event created successfully! Redirecting to upcoming events...");
        router.push("/upcoming-events");
      } else {
        toast.error(res.message || "Failed to create event. Please check your data.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Quick fill helper for testing
  function handlePrefillSample() {
    setTitle("Winter Clothes & Blanket Distribution Drive");
    setDescription(
      "Join us to distribute warm winter clothes, blankets, and essential winter supplies to underprivileged families and children in the Mirpur 10 area. Volunteers are welcome to help with distribution and packaging."
    );
    setEventType("Donation");
    setThumbnailUrl(
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&q=80"
    );
    setLocation("Mirpur 10 Community Center, Dhaka");
    setDate(getTomorrowDate());
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/upcoming-events"
                className="text-sm font-medium text-muted transition hover:text-primary"
              >
                ← Back to Upcoming Events
              </Link>

              <span className="mt-4 block text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Bring People Together
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Create a Community Event
              </h1>
            </div>

            <button
              type="button"
              onClick={handlePrefillSample}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:self-auto"
            >
              <span>⚡</span> Prefill Sample Data
            </button>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Have an idea that can make a difference? Create an event and invite your
            community to be part of something meaningful.
          </p>
        </div>
      </section>

      {/* Create Event Form */}
      <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-9 lg:p-10">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Event Information
              </h2>
              <p className="mt-1 text-sm text-muted">
                Fill in the details below to publish your community service event.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Title <span className="text-accent">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Event Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Description <span className="text-accent">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  maxLength={2000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event, its purpose, what volunteers will do, and what participants should bring..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3.5 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Event Type Dropdown (PDF Requirement Page 4) */}
              <div>
                <label
                  htmlFor="eventType"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Type <span className="text-accent">*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="" disabled>
                    Select an event category
                  </option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Community Support">Community Support</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Thumbnail Image URL */}
              <div>
                <label
                  htmlFor="thumbnailUrl"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Thumbnail Image URL <span className="text-accent">*</span>
                </label>
                <input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <p className="mt-1 text-xs text-muted">
                  Provide a direct, publicly accessible image URL for the event cover.
                </p>
              </div>

              {/* Location and Event Date */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Location <span className="text-accent">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    maxLength={200}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mohammadpur, Dhaka"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Event Date (Only Future Dates Allowed) */}
                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Event Date <span className="text-accent">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Only future dates are allowed (Earliest: {minDate})
                  </p>
                </div>
              </div>

              {/* Creator Email Info Badge (PDF Requirement Page 4) */}
              <div className="rounded-2xl border border-border bg-surface-secondary p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    👤
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Event Organizer Email
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {user?.email || "Authenticating..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  Fields marked with <span className="text-accent">*</span> are required.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || isFetchingJwt || !isJwtReady && !sessionToken}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetchingJwt ? "Preparing authentication..." : isSubmitting ? "Creating Event..." : "Publish Event"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

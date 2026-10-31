
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

// Calculate tomorrow's date in the user's local timezone.
// This function must only run inside useEffect or an event handler.
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CreateEventPage() {
  const [minDate] = useState(() => getTomorrowDate());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "info" | "">("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const selectedDate = formData.get("date") as string;

    // Recalculate inside the event handler to validate against the current date.
    const earliestAllowedDate = getTomorrowDate();

    if (!selectedDate || selectedDate < earliestAllowedDate) {
      setMessage(
        "Please select a future date. Today's and past dates are not allowed."
      );
      setMessageType("error");
      return;
    }

    setMessage(
      "Your form has passed frontend validation. Event creation will be enabled after backend integration."
    );
    setMessageType("info");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition hover:text-primary"
          >
            ← Back to Home
          </Link>

          <span className="mt-8 block text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Bring People Together
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create a Community Event
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Have an idea that can make a difference? Create an event
            and invite your community to be part of something meaningful.
          </p>
        </div>
      </section>

      {/* Create Event Form */}
      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-9 lg:p-10">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Event Information
              </h2>

              <p className="mt-2 text-sm text-muted">
                Fill in the details below to prepare your community event.
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
                  placeholder="Enter your event title"
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
                  placeholder="Describe your event, its purpose, and what participants can expect..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3.5 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Event Type */}
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
                  defaultValue=""
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="" disabled>
                    Select an event type
                  </option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Community Support">Community Support</option>
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
                  placeholder="https://example.com/event-image.jpg"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="mt-2 text-xs text-muted">
                  Provide a publicly accessible image URL for your event.
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
                    placeholder="Enter event location"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Future Date Only */}
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
                    min={minDate || undefined}
                    disabled={!minDate}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-wait disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs text-muted">
                    {minDate
                      ? "Only future dates are allowed."
                      : "Preparing date selection..."}
                  </p>
                </div>
              </div>

              {/* Creator Email */}
              <div className="rounded-xl border border-border bg-surface-secondary p-4">
                <p className="text-sm font-semibold text-foreground">
                  Event Creator
                </p>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Your authenticated account email will automatically be
                  saved with this event after authentication and backend
                  integration.
                </p>
              </div>

              {/* Validation Feedback */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                    messageType === "error"
                      ? "border-red-500/20 bg-red-500/10 text-red-600"
                      : "border-primary/20 bg-primary/10 text-primary"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  Fields marked with * are required.
                </p>

                <button
                  type="submit"
                  disabled={!minDate}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create Event
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

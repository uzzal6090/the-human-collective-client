"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getMyEventsApi, updateEventApi, deleteEventApi, type EventItem } from "@/src/lib/api";

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minDate] = useState(() => getTomorrowDate());

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editEventType, setEditEventType] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getMyEventsApi()
      .then((data) => {
        if (isMounted) {
          setEvents(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching my events:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Open Edit Modal and prefill data
  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditEventType(event.eventType);
    setEditThumbnailUrl(event.thumbnailUrl);
    setEditLocation(event.location);
    setEditDate(event.date);
  };

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  // Submit Update Event Form (PDF Page 5 - Creator Only, Future Date validation)
  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editTitle.trim() || !editDescription.trim() || !editEventType || !editThumbnailUrl.trim() || !editLocation.trim() || !editDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Future date validation
    if (editDate < minDate) {
      toast.error("Event date must be in the future. Past dates are not allowed.");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await updateEventApi(editingEvent._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        eventType: editEventType,
        thumbnailUrl: editThumbnailUrl.trim(),
        location: editLocation.trim(),
        date: editDate,
      });

      if (res.success) {
        toast.success("Event updated successfully!");
        setEvents((prev) =>
          prev.map((item) =>
            item._id === editingEvent._id
              ? {
                  ...item,
                  title: editTitle.trim(),
                  description: editDescription.trim(),
                  eventType: editEventType,
                  thumbnailUrl: editThumbnailUrl.trim(),
                  location: editLocation.trim(),
                  date: editDate,
                }
              : item
          )
        );
        handleCloseEdit();
      } else {
        toast.error(res.message || "Failed to update event.");
      }
    } catch {
      toast.error("An unexpected error occurred while updating.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm and Execute Delete (PDF Page 5 - Creator Only)
  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;

    setIsDeleting(true);

    try {
      const res = await deleteEventApi(deletingEvent._id);
      if (res.success) {
        toast.success("Event deleted successfully.");
        setEvents((prev) => prev.filter((item) => item._id !== deletingEvent._id));
        setDeletingEvent(null);
      } else {
        toast.error(res.message || "Failed to delete event.");
      }
    } catch {
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Organizer Dashboard
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Manage Events
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                View, update, or remove events you have created. You have full control over your organized events.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 self-start rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-button-primary-hover hover:text-white sm:self-auto"
            >
              <span>+</span> Create New Event
            </Link>
          </div>
        </div>
      </section>

      {/* Main Events Table / Cards */}
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
                  <div className="h-10 w-24 rounded-xl bg-surface-secondary" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                📅
              </div>

              <h3 className="mt-6 text-xl font-bold text-foreground sm:text-2xl">
                No Events to Manage Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                You haven&apos;t created any events yet. Create your first community gathering to bring people together.
              </p>

              <Link
                href="/create-event"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-button-primary-hover hover:text-white"
              >
                Create Your First Event
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            /* Events Table / Card List */
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <p className="text-sm font-bold text-foreground">
                  Your Hosted Events ({events.length})
                </p>
              </div>

              <div className="divide-y divide-border">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  const formattedDate = !Number.isNaN(eventDate.getTime())
                    ? eventDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : event.date;

                  return (
                    <div
                      key={event._id}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-surface-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      {/* Event Details */}
                      <div className="flex items-start gap-4">
                        <div
                          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-secondary bg-cover bg-center"
                          style={
                            event.thumbnailUrl
                              ? { backgroundImage: `url("${event.thumbnailUrl}")` }
                              : undefined
                          }
                        >
                          {!event.thumbnailUrl && (
                            <div className="flex h-full items-center justify-center text-xs text-muted">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {event.eventType}
                          </span>

                          <h3 className="mt-1 line-clamp-1 text-base font-bold text-foreground">
                            {event.title}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              📍 {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              📅 {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/upcoming-events/${event._id}`}
                          className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(event)}
                          className="rounded-xl border border-border bg-surface-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-primary hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingEvent(event)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UPDATE EVENT MODAL (PDF Challenge Requirement #1 - Validation) */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Update Event
                </h2>
                <p className="text-xs text-muted">
                  Make changes to your event information.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-secondary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                    Event Type *
                  </label>
                  <select
                    value={editEventType}
                    onChange={(e) => setEditEventType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="Cleanup">Cleanup</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Donation">Donation</option>
                    <option value="Education">Education</option>
                    <option value="Community Support">Community Support</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    Only future dates allowed
                  </p>
                </div>
              </div>

              {/* Location & Image URL */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editThumbnailUrl}
                    onChange={(e) => setEditThumbnailUrl(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-button-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-button-primary-hover disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-600">
              ⚠️
            </div>

            <h3 className="mt-4 text-lg font-bold text-foreground">
              Delete Event?
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{deletingEvent.title}&quot;</span>? This action is permanent and cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                disabled={isDeleting}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

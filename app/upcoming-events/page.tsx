
import Link from "next/link";

export default function UpcomingEventsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Be Part of the Change
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Upcoming Events
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Discover meaningful community events, meet people who
            share your passion, and take part in creating positive
            change.
          </p>
        </div>
      </section>

      {/* Events Content */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Explore Events
              </h2>

              <p className="mt-2 text-sm text-muted">
                Find opportunities to connect and contribute.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-button-primary-hover hover:text-white"
            >
              + Create an Event
            </Link>
          </div>

          {/* Search and Filter UI */}
          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="search"
              placeholder="Search events..."
              aria-label="Search events"
              className="w-full rounded-xl border border-border bg-surface px-5 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <select
              aria-label="Filter events by category"
              defaultValue="all"
              className="w-full rounded-xl border border-border bg-surface px-5 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="all">All Event Types</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
              <option value="community">Community Support</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Events Grid / Empty State */}
          <div className="mt-12">
            <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                <span aria-hidden="true">🌱</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-foreground sm:text-2xl">
                No Upcoming Events Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                There are no upcoming events to display right now.
                Be the first to create an event and bring your
                community together.
              </p>

              <Link
                href="/create-event"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-button-primary-hover hover:text-white"
              >
                Create Your First Event
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

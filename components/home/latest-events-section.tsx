
import Link from "next/link";
import EventCard, {
  type EventPreview,
} from "@/components/events/event-card";

type LatestEventsSectionProps = {
  events?: EventPreview[];
};

export default function LatestEventsSection({
  events = [],
}: LatestEventsSectionProps) {
  // Show a maximum of 6 events
  const latestEvents = events.slice(0, 6);

  return (
    <section className="bg-surface-secondary/50 px-5 py-16 transition-colors duration-300 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Make a Difference
            </span>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Latest Upcoming Events
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Discover meaningful opportunities to connect, contribute,
              and create positive change.
            </p>
          </div>

          {/* View All Events Button */}
          <Link
            href="/upcoming-events"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-button-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-md hover:shadow-primary/10"
          >
            View all events
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Events Grid */}
        {latestEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-14 text-center sm:py-16">
            {/* Empty State Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
                <path d="M8 15h3M8 18h7" />
              </svg>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground">
              No upcoming events yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              New community events will appear here as soon as they are
              created. Check back soon!
            </p>

            {/* Explore Events Button */}
            <Link
              href="/upcoming-events"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-md hover:shadow-primary/10"
            >
              Explore Events
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

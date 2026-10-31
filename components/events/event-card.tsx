import Link from "next/link";

export type EventPreview = {
  id?: string;
  _id?: string;
  title: string;
  location: string;
  eventType: string;
  date: string;
  thumbnailUrl: string;
  description?: string;
};

type EventCardProps = {
  event: EventPreview;
};

export default function EventCard({ event }: EventCardProps) {
  const eventId = event._id || event.id || "";
  const eventDate = new Date(event.date);

  const formattedDate = Number.isNaN(eventDate.getTime())
    ? event.date || "Date unavailable"
    : eventDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div>
        {/* Event Thumbnail */}
        <div
          role="img"
          aria-label={`${event.title} event thumbnail`}
          className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary bg-cover bg-center"
          style={
            event.thumbnailUrl
              ? { backgroundImage: `url("${event.thumbnailUrl}")` }
              : undefined
          }
        >
          {!event.thumbnailUrl && (
            <div className="flex h-full items-center justify-center text-muted">
              <span className="text-sm">🌱 Event image</span>
            </div>
          )}

          {/* Event Type Badge */}
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md shadow-sm">
            {event.eventType}
          </span>
        </div>

        {/* Event Information */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {event.title}
          </h3>

          <div className="mt-4 space-y-2 text-sm text-muted">
            {/* Location */}
            <p className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className="line-clamp-1">{event.location}</span>
            </p>

            {/* Date */}
            <p className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* View Event Button (sticks to bottom for equal card height) */}
      <div className="p-5 pt-0">
        <Link
          href={`/upcoming-events/${eventId}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-button-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-md"
        >
          View Event
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

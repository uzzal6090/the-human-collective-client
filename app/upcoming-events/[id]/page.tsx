
import Link from "next/link";

type EventDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <span aria-hidden="true">←</span>
            Back to Upcoming Events
          </Link>
        </div>
      </div>

      {/* Event Details */}
      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Event Image Placeholder */}
          <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-3xl bg-surface-secondary">
            <div className="text-center">
              <span className="text-5xl" aria-hidden="true">
                🌱
              </span>
              <p className="mt-3 text-sm text-muted">
                Event thumbnail will appear here
              </p>
            </div>
          </div>

          {/* Event Information */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {/* Event Type */}
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Event Details
              </span>

              {/* Event Title */}
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Event Title
              </h1>

              {/* Event Description */}
              <div className="mt-9">
                <h2 className="text-xl font-bold text-foreground">
                  About This Event
                </h2>

                <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
                  Event description will be displayed here once the event
                  information is loaded from our backend API.
                </p>
              </div>

              {/* Event Information */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-foreground">
                  Event Information
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Location
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
                      Location will appear here
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Event Date
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
                      Date will appear here
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Event ID
                    </p>
                    <p className="mt-2 break-all font-semibold text-foreground">
                      {id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Event Card */}
            <aside>
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-lg font-bold text-foreground">
                  Interested in Joining?
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted">
                  Be part of this community initiative and contribute
                  to creating a positive impact.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-full bg-button-primary px-6 py-3.5 text-sm font-semibold text-white opacity-60"
                >
                  Join Event
                </button>

                <p className="mt-3 text-center text-xs text-muted">
                  Event participation will be available after backend integration.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

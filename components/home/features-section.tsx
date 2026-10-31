
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
    title: "Discover Events",
    description:
      "Explore upcoming community events and find opportunities to make a difference.",
    link: "Explore events",
    href: "/upcoming-events",
    accent: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    number: "02",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    title: "Create Events",
    description:
      "Bring people together by creating meaningful events for your community.",
    link: "Create an event",
    href: "/create-event",
    accent: "text-accent",
    iconBg: "bg-accent/10",
  },
  {
    number: "03",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 8v6M17 11h6" />
      </svg>
    ),
    title: "Join & Participate",
    description:
      "Connect with like-minded people and take part in positive community action.",
    link: "Join the community",
    href: "/upcoming-events",
    accent: "text-primary",
    iconBg: "bg-primary/10",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-background px-5 py-16 transition-colors duration-300 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What We Do
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Small Actions.{" "}
            <span className="text-primary">Meaningful Impact.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
            Discover opportunities to connect, participate, and create
            positive change together.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg} ${feature.accent}`}
                >
                  {feature.icon}
                </div>

                <span className="text-xs font-medium tracking-wider text-muted/60">
                  {feature.number}
                </span>
              </div>

              <h3 className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg">
                {feature.title}
              </h3>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${feature.accent} transition-all duration-300 group-hover:gap-3`}
              >
                {feature.link}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

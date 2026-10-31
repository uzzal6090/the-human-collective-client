
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-cover bg-center px-5 py-12 sm:px-8 lg:px-12"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2200&q=90')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/40 to-black/70" />

      {/* Hero Content */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center text-white">

        {/* Brand Label */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-button-accent" />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs">
            The Human Collective
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.12] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[76px]">
          Together, We Can
          <span className="mt-2 block text-[#e5a17f]">
            Make a Difference.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8 lg:text-lg">
          Discover meaningful community events, connect with people
          who care, and turn shared intentions into real impact.
          Because a better world starts with us.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">

          {/* Primary CTA */}
          <Link
            href="/upcoming-events"
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-button-accent px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-button-accent-hover hover:text-white sm:w-auto"
          >
            Explore Events
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/create-event"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-primary sm:w-auto"
          >
            Create an Event
            <span>↗</span>
          </Link>

        </div>

        {/* Bottom Caption */}
        <div className="mt-12 flex items-center gap-3">
          <span className="h-px w-8 bg-white/50" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/75 sm:text-[10px]">
            Connect · Contribute · Create Change
          </p>

          <span className="h-px w-8 bg-white/50" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/65 lg:flex">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
          Discover More
        </span>
        <span className="text-lg">↓</span>
      </div>
    </section>
  );
}

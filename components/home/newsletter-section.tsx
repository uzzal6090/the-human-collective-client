
export default function NewsletterSection() {
  return (
    <section className="bg-surface-secondary px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-button-primary px-6 py-14 text-center shadow-xl shadow-primary/10 sm:px-12 sm:py-16">
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10" />

          {/* Newsletter Content */}
          <div className="relative mx-auto max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5a17f]">
              Stay Connected
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Be Part of Something Meaningful.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Stay updated with upcoming community events, inspiring stories,
              and opportunities to make a positive difference.
            </p>

            {/* Newsletter Form UI */}
            <div className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/20 bg-white px-5 py-3.5 text-sm text-[#202b24] outline-none transition placeholder:text-gray-500 focus:border-[#e5a17f] focus:ring-2 focus:ring-[#e5a17f]/30"
              />

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-button-accent px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-accent-hover hover:text-white hover:shadow-lg"
              >
                Subscribe
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p className="mt-5 text-xs text-white/55">
              Join us in creating positive change, one step at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

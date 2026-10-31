
const galleryImages = [
  {
    id: 1,
    title: "Together for a Greener Future",
    category: "Environment",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900&q=85",
    alt: "Green natural environment",
  },
  {
    id: 2,
    title: "Sharing Hope and Kindness",
    category: "Community Support",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=85",
    alt: "People participating in a community activity",
  },
  {
    id: 3,
    title: "Building a Better Tomorrow",
    category: "Social Impact",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=900&q=85",
    alt: "Volunteers working together",
  },
  {
    id: 4,
    title: "Small Acts, Big Impact",
    category: "Volunteering",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=85",
    alt: "Community volunteers helping others",
  },
  {
    id: 5,
    title: "Growing Together",
    category: "Environment",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85",
    alt: "Green landscape and nature",
  },
  {
    id: 6,
    title: "United by a Common Purpose",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85",
    alt: "A group of people spending time together",
  },
];

export default function PhotoGallerySection() {
  return (
    <section className="bg-background px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Moments That Matter
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A Community in Action
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Every meaningful change begins with people coming together.
            Explore moments of kindness, collaboration, and positive impact.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-surface-secondary"
            >
              {/* Image - Same Size for All Cards */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Image Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {item.category}
                  </span>

                  <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-muted">
            Every person. Every action. Every moment makes a difference.
          </p>
        </div>
      </div>
    </section>
  );
}

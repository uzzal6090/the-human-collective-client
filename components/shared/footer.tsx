
import Link from "next/link";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Upcoming Events", href: "/upcoming-events" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Create an Event", href: "/create-event" },
      { label: "Join an Event", href: "/upcoming-events" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Information */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-button-primary text-xl font-bold text-white">
                H
              </span>

              <span>
                <span className="block text-lg font-bold tracking-tight text-foreground">
                  The Human Collective
                </span>
                <span className="block text-xs text-muted">
                  Together for change
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Bringing people together through meaningful community events,
              shared experiences, and collective action for a better tomorrow.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-bold text-muted transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-bold text-muted transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                ig
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-bold text-muted transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                in
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-foreground">
                {group.title}
              </h3>

              <ul className="mt-5 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} The Human Collective. All rights reserved.
          </p>

          <p className="text-xs font-medium text-muted">
            Connect · Contribute · Create Change
          </p>
        </div>
      </div>
    </footer>
  );
}

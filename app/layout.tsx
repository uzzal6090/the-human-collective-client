
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Human Collective | Together We Create Impact",
    template: "%s | The Human Collective",
  },
  description:
    "A community-driven platform connecting people through meaningful social development events, volunteering, and collective action.",
  applicationName: "The Human Collective",
  keywords: [
    "The Human Collective",
    "Community Development",
    "Volunteering",
    "Social Impact",
    "Community Events",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

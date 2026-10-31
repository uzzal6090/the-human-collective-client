import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/src/context/auth-context";
import { ThemeProvider } from "@/src/context/theme-context";
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
      <body className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "#234b37",
                  color: "#ffffff",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#ffffff",
                    secondary: "#234b37",
                  },
                },
                error: {
                  style: {
                    background: "#ae3d3d",
                    color: "#ffffff",
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
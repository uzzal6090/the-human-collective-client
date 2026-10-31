import { Suspense } from "react";
import DashboardClientLayout from "./dashboard-client-layout";

// Opt authenticated dashboard routes out of instant-navigation static shell validation
export const instant = false;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardClientLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-muted">Loading...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </DashboardClientLayout>
  );
}

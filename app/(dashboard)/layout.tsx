import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard layout — server-side session guard.
 *
 * middleware.ts handles the edge-level protection for most cases.
 * This layout adds a server-component double-check for robustness.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

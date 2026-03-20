import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/types";

/**
 * requireAuth — use in Server Components and API routes to ensure a valid session exists.
 * Redirects to /login if unauthenticated.
 *
 * @example
 * const session = await requireAuth();
 * console.log(session.user.role);
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * requireRole — ensures the user is authenticated AND has one of the allowed roles.
 * Redirects to /login if unauthenticated, or /unauthorized if role not permitted.
 *
 * @example
 * await requireRole(["ADMIN", "COLLEGE"]);
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  const userRole = session.user.role as Role;

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * getOptionalSession — returns session or null. Does not redirect.
 * Use in public pages that optionally show auth-aware UI.
 */
export async function getOptionalSession() {
  return auth();
}

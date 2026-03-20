/**
 * Unauthorized page — shown when a user accesses a route they don't have a role for.
 * E.g. a STUDENT trying to access /admin.
 */
export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
      <a
        href="/leaderboard"
        className="text-sm text-primary underline underline-offset-4"
      >
        Go to Leaderboard
      </a>
    </main>
  );
}

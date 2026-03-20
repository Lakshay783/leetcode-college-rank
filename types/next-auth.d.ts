import type { DefaultSession } from "next-auth";
import type { Role } from "./index";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type with `id` and `role`.
   * Accessible via `session.user.id` and `session.user.role` everywhere.
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in User type so the adapter passes `role` through.
   */
  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT token type to carry `role` and `id`.
   * Set in the `jwt` callback in lib/auth.ts.
   */
  interface JWT {
    id?: string;
    role?: Role;
  }
}

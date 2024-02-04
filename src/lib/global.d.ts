import { PrismaClient } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare global {
  namespace globalThis {
    var prisma: PrismaClient;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

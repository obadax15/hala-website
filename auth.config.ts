import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth config — NO Node.js-only imports (no argon2, no prisma).
 * Used by middleware.ts which runs on the Edge runtime.
 * auth.ts extends this with the full PrismaAdapter + CredentialsProvider.
 */
export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/en/admin/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts — empty here for Edge compat
} satisfies NextAuthConfig;

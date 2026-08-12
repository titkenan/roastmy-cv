import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  // @ts-expect-error — Prisma Adapter v2 has minor type mismatch with NextAuth v4, runtime works
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt', // JWT for serverless-friendly sessions (Vercel)
  },
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: attach user id + plan
      if (user) {
        token.id = user.id;
        const dbUser = await db.user.findUnique({
          where: { id: (user as { id: string }).id },
          select: { plan: true, stripeCustomerId: true, stripeSubscriptionId: true },
        });
        token.plan = dbUser?.plan || 'free';
        token.stripeCustomerId = dbUser?.stripeCustomerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { plan?: string }).plan = (token.plan as string) || 'free';
      }
      return session;
    },
  },
  pages: {
    // No custom sign-in page — use default NextAuth page
    signIn: '/api/auth/signin',
  },
};

// Helper: extend NextAuth Session type
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
    };
  }
  interface User {
    plan?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    plan?: string;
    stripeCustomerId?: string | null;
  }
}

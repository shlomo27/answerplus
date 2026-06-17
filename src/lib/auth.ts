import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: true,
  logger: {
    error(error: Error & { cause?: unknown }) {
      const serialize = (obj: unknown, depth = 0): unknown => {
        if (depth > 3) return String(obj);
        if (obj instanceof Error) {
          return { name: obj.name, message: obj.message, cause: serialize(obj.cause, depth + 1) };
        }
        if (obj && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, serialize(v, depth + 1)])
          );
        }
        return obj;
      };
      console.error("[AUTH ERROR FULL]", JSON.stringify(serialize(error), null, 2));
    },
    warn(code: string) {
      console.warn("[AUTH WARN]", code);
    },
    debug(code: string, metadata?: unknown) {
      if (code === "callback route error details") {
        console.log("[AUTH DEBUG]", code, JSON.stringify(metadata, (_, v) => {
          if (v instanceof Error) return { name: v.name, message: v.message, cause: String((v as Error & { cause?: unknown }).cause) };
          return v;
        }, 2));
      }
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordMatch) return null;
        if (!user.emailVerified) throw new Error("EmailNotVerified");
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
              },
            });
          } else if (!existingUser.emailVerified) {
            await prisma.user.update({
              where: { email: user.email! },
              data: { emailVerified: new Date(), image: user.image },
            });
          }
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      // Always resolve DB user by email so we use our cuid, not the OAuth sub
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, username: true, avatarId: true, onboarded: true, interests: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            token.avatarId = dbUser.avatarId;
            token.onboarded = dbUser.onboarded;
            token.interests = dbUser.interests ? JSON.parse(dbUser.interests) : [];
          }
        } catch {
          // ignore DB errors
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string | null) ?? null;
        session.user.avatarId = (token.avatarId as string | null) ?? null;
        session.user.onboarded = (token.onboarded as boolean) ?? false;
        session.user.interests = (token.interests as string[]) ?? [];
      }
      return session;
    },
  },
});

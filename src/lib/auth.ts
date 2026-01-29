import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    // Riot Games OAuth Provider
    {
      id: "riot",
      name: "Riot Games",
      type: "oauth",
      authorization: {
        url: "https://auth.riotgames.com/authorize",
        params: {
          scope: "openid",
          response_type: "code",
        },
      },
      token: "https://auth.riotgames.com/token",
      userinfo: "https://auth.riotgames.com/userinfo",
      clientId: process.env.RIOT_CLIENT_ID,
      clientSecret: process.env.RIOT_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.gameName
            ? `${profile.gameName}#${profile.tagLine}`
            : profile.sub,
          riotPuuid: profile.sub,
          riotGameName: profile.gameName,
          riotTagLine: profile.tagLine,
        };
      },
    },
    // Email/Password Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account?.provider === "riot") {
          token.riotPuuid = (user as { riotPuuid?: string }).riotPuuid;
          token.riotGameName = (user as { riotGameName?: string }).riotGameName;
          token.riotTagLine = (user as { riotTagLine?: string }).riotTagLine;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.riotPuuid = token.riotPuuid as string | undefined;
        session.user.riotGameName = token.riotGameName as string | undefined;
        session.user.riotTagLine = token.riotTagLine as string | undefined;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

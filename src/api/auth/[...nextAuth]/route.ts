import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mongoId: string;
      role: string;
    };
  }

  interface User {
    mongoId?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    mongoId?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? 'user',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { name, email, role, image } = user;

        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, role, image }),
          });

          const data = await res.json();

          if (res.ok) {
            user.mongoId = data.data._id;
            user.role = data.data.role;
            return true;
          } else {
            console.error('❌ User creation failed', data);
            return false;
          }
        } catch (error) {
          console.error('❌ signIn error:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.mongoId = user.mongoId;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.mongoId = token.mongoId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

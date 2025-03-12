import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/user.schema";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      await dbconnect();
      // if (!account || !account.user || typeof account.user !== 'string') {
      //   return false;
      // }

      // console.log(user.email);
      try {
        const currUser = await UserModel.findOne({
          email: user.email,
        });
        // console.log(currUser);
        if (currUser == null) {
          await UserModel.create({ email: user.email, id: user.id });
        }
      } catch (error) {
        console.log(error);
      }

      // if (!currUser) {
      //   const newuser = await UserModel.create({ email: user.email });
      //   console.log(account);
      //   console.log(newuser);
      //   console.log(user);
      //   if (!user) {
      //     return false;
      //   }
      // }
      return true;
    },
    // async jwt({ user, token }) {
    //   if (user) {
    //     token.user = { id: user.id };
    //   }

    //   return token;
    // },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    // async session({ token, user, session }) {
    //   if (token) {
    //     session.user.id = user.id;
    //   }
    //   console.log(session);

    //   return session;
    // },
    session: ({ session, token }) => {
      // console.log(token);
      if (token) {
        session.user.id = token.id as string;
      }
      // console.log("sess",session);

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

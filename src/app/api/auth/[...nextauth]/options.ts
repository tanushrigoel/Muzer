import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/user.schema";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
      async signIn({ user }) {
        await dbconnect();
        try {
          const currUser = await UserModel.findOne({
            email: user.email,
          });
          if (currUser == null) {
            await UserModel.create({ email: user.email, id: user.id });
          }
        } catch (error) {
          console.log(error);
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
  
        return token;
      },
      session: ({ session, token }) => {
        if (token) {
          session.user.id = token.id as string;
        }
  
        return session;
      },
    },
  };
  
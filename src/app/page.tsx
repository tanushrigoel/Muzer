"use client";

import { motion } from "framer-motion";
import { ArrowRight, Music2, ThumbsUp, Users } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const { data: session, status } = useSession();
  // console.log("app ses", session);
  useEffect(() => {
    if (status === "authenticated") {
      toast.success("Logged in successfully");
      redirect("/dashboard");
    }
  }, [session, status]);

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-50">
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                <Music2 className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg font-semibold tracking-tight text-zinc-50"
            >
              StreamVibe
            </motion.span>
          </Link>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link
              href="#"
              onClick={() => signIn("google")}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              Log in
            </Link>
            <Link
              href="#"
              onClick={() => signIn("google")}
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              Sign up free
            </Link>
          </motion.div>
        </div>
      </nav>
      <div className="container flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16 md:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* <span className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
              Launching Soon
            </span> */}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-4xl font-bold tracking-tight text-zinc-50 [text-shadow:_0_0_30px_rgba(255,255,255,0.2)] sm:text-6xl"
          >
            Let Your Audience
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Shape the Music
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg text-zinc-400"
          >
            Create streams, add your favorite tracks, and let your audience vote
            for what plays next. Democratic music streaming for everyone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            {/* <Link
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Learn More
            </Link> */}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
            <Music2 className="h-12 w-12 text-purple-400" />
            <h3 className="mt-4 font-semibold text-zinc-50">Create Streams</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Start your music stream and add your favorite tracks
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
            <ThumbsUp className="h-12 w-12 text-purple-400" />
            <h3 className="mt-4 font-semibold text-zinc-50">
              Democratic Voting
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Let your audience vote for the next track
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center sm:col-span-2 lg:col-span-1">
            <Users className="h-12 w-12 text-purple-400" />
            <h3 className="mt-4 font-semibold text-zinc-50">Build Community</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Connect with listeners who share your taste
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

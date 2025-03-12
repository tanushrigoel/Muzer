"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Music2,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { IStream } from "@/models/types";
import YouTube, { YouTubeProps } from "react-youtube";
import { redirect, useParams } from "next/navigation";
// thumbnail preview
// url extracted have to show on frontend
// have to show the loading state, if there is any error

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = React.useState<IStream[]>([]);
  // const [url, setUrl] = useState<string>("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<IStream | null>(
    null
  );
  const [queueTracks, setQueueTracks] = useState<IStream[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [urlValide, setUrlValide] = useState<boolean>(false);
  // const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const param = useParams<{ id: string }>();

  const fetchData = async function () {
    try {
      const res = await axios.get(`api/streams?userid=${param.id}`);
      const fetchedTracks = res.data.data;
      if (!currentlyPlaying && fetchedTracks.length > 0) {
        const sortedTracks = [...fetchedTracks].sort(
          (a, b) => b.upVotes - a.upVotes
        );
        setCurrentlyPlaying(sortedTracks[0]);
        const remainingTracks = fetchedTracks.filter(
          (track: IStream) => track.id !== sortedTracks[0].id
        );
        setQueueTracks(remainingTracks);
        setTracks(fetchedTracks);
      } else {
        setTracks(fetchedTracks);

        // Update queue tracks but exclude the currently playing one
        if (currentlyPlaying) {
          const remainingTracks = fetchedTracks.filter(
            (track: IStream) => track.id !== currentlyPlaying.id
          );
          // Sort the queue by upvotes
          setQueueTracks(
            remainingTracks.sort(
              (a: IStream, b: IStream) => b.upVotes - a.upVotes
            )
          );
        } else {
          setQueueTracks(
            fetchedTracks.sort(
              (a: IStream, b: IStream) => b.upVotes - a.upVotes
            )
          );
        }
      }
    } catch (error) {
      console.log("Error fetching tracks:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    if (status === "authenticated") {
      // setLoading(true);
      fetchData();
      // setLoading(false);
    }
  }, [session, status]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleVote = async (id: string, increment: boolean) => {
    // Update the local state immediately for better UX
    console.log(id);

    const updatedTracks = tracks.map((track) =>
      track.id === id
        ? { ...track, upVotes: track.upVotes + (increment ? 1 : -1) }
        : track
    );
    setTracks(updatedTracks);

    // Update queue tracks (excluding currently playing)
    const updatedQueueTracks = updatedTracks
      .filter((track) => currentlyPlaying && track.id !== currentlyPlaying.id)
      .sort((a, b) => b.upVotes - a.upVotes);
    setQueueTracks(updatedQueueTracks);

    try {
      if (increment) {
        await axios.post("/api/streams/upvote", { streamId: id });
      } else {
        await axios.post("/api/streams/downvote", { streamId: id });
      }
      // No need to fetch data again, we've already updated local state
    } catch (error) {
      console.log("Error voting:", error);
      // Revert the UI changes on error by fetching fresh data
      fetchData();
    }
  };

  const handleEnd = async () => {
    try {
      if (!currentlyPlaying) return;

      // Delete the currently playing stream
      await axios.delete(`/api/streams`, { data: { id: currentlyPlaying.id } });

      // Set the highest upvoted track as the next playing track
      if (queueTracks.length > 0) {
        // queueTracks is already sorted by upvotes
        const nextTrack = queueTracks[0];
        setCurrentlyPlaying(nextTrack);

        // Update the queue tracks
        setQueueTracks(
          queueTracks.filter((track) => track.id !== nextTrack.id)
        );
      } else {
        setCurrentlyPlaying(null);
      }

      // Refresh the data
      fetchData();
    } catch (error) {
      console.log("Error handling end:", error);
    }
  };

  return (
    <div className="min-h-screen dark bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">StreamVibe</h1>
          </div>
          <div>
            <Button className="bg-red-700 text-white" onClick={() => signOut()}>
              <LogOut /> Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                {currentlyPlaying ? (
                  <YouTube
                    videoId={currentlyPlaying.extractedid}
                    opts={opts}
                    onReady={onPlayerReady}
                    onEnd={handleEnd}
                  />
                ) : (
                  <div className="text-center">
                    <Play className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-zinc-400">
                      No music in the queue. Add some tracks!
                    </p>
                  </div>
                )}
              </div>
              {currentlyPlaying && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={currentlyPlaying.image || "/placeholder.svg"}
                      alt={currentlyPlaying.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {currentlyPlaying.title}
                    </h3>
                    <p className="text-sm text-zinc-400">Now Playing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="text-white">Queue</CardTitle>
              <div className="ml-auto text-zinc-400">
                <span className="text-sm">Sorted by Votes</span>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <AnimatePresence>
                  <div className="space-y-4">
                    {queueTracks.length > 0 ? (
                      queueTracks.map((track) => (
                        <motion.div
                          key={track.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                            opacity: { duration: 0.2 },
                          }}
                        >
                          <div className="flex items-center gap-4 group">
                            <div className="flex flex-col items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-purple-400"
                                onClick={() => handleVote(track.id, true)}
                              >
                                <ChevronUp className="h-6 w-6" />
                              </Button>
                              <motion.span
                                key={track.upVotes}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-sm font-medium text-white"
                              >
                                {track.upVotes}
                              </motion.span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-purple-400"
                                onClick={() => handleVote(track.id, false)}
                              >
                                <ChevronDown className="h-6 w-6" />
                              </Button>
                            </div>
                            <div className="h-20 w-20 relative rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={track.image || "/placeholder.svg"}
                                alt={track.title ?? ""}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-white truncate">
                                {track.title}
                              </h3>
                            </div>
                          </div>
                          <Separator className="my-4 bg-zinc-700" />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-zinc-400">
                        No tracks in queue
                      </div>
                    )}
                  </div>
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

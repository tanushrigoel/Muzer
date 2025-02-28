"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Link2, Music2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IStream } from "@/models/types";
import YouTube, { YouTubeProps } from 'react-youtube';

export default function dashboard() {
  // console.log(useSession());

  const { data: session, status } = useSession();
  const [tracks, setTracks] = React.useState<IStream[]>([]);
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  const fetchData = async function () {
    const res = await axios.get(`api/streams?userid=${session?.user.id}`);
    setTracks(res.data.data);
    console.log(res.data.data);
  };
  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [session]);

  let addURL = async function () {
    try {
      let res = await axios.post("/api/streams", { url: url });
      fetchData();

      console.log("URL added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleVote = (id: string, increment: boolean) => {
    setTracks(
      tracks
        .map((track) =>
          track.id === id
            ? { ...track, votes: track.upVotes + (increment ? 1 : -1) }
            : track
        )
        .sort((a, b) => b.upVotes - a.upVotes)
    );
  };

  return (
    <div className="min-h-screen dark bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">StreamVibe</h1>
          </div>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Enter music URL..."
              id="urlinput"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addURL();
              }}
              className="flex-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
            />
            <Button
              variant="secondary"
              onClick={addURL}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Add to Queue
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
                <div className="text-center">
                  <Play className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-zinc-400">
                    Music player embed will appear here
                    <YouTube videoId="FW2XOIxaNqg" opts={opts} onReady={onPlayerReady}></YouTube>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="text-white">Queue</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-zinc-400 hover:text-white"
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Sort by Votes
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <AnimatePresence>
                  <div className="space-y-4">
                    {tracks.length > 0 &&
                      tracks?.map((track) => (
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
                              <p className="text-xs text-zinc-400 truncate">
                                {track.url}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Play className="h-4 w-4 text-purple-400" />
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-4 bg-zinc-700" />
                        </motion.div>
                      ))}
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

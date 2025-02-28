"use client";

import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import React, { useEffect, useState } from "react";

function Redirect() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session]);

  // const user: User = session?.user;
  const [streams, setStreams] = useState([]);

  // useEffect(() => {
  //   const solve = async () => {
  //     try {
  //       const res = await axios.get(`/api/streams?${user.id}`);
  //       setStreams(res.data);
  //     } catch (error) {}
  //   };
  //   solve();
  // }, []);

  return <div>Redirect</div>;
}

export default Redirect;

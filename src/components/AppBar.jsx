"use client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function AppBar() {
  const handleClick = () => {
    signIn();
  };
  const { data: session } = useSession(authOptions);

  return (
    <div className="flex justify-between">
      <div>Muzer</div>
      <div>
        {session?.user ? (
          <button onClick={() => signOut("google")}>Logout</button>
        ) : (
          <button
            className="m-2 p-2 bg-blue-400"
            onClick={() => signIn("google")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default AppBar;

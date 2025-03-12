import { Stream } from "@/models/stream.schema";
import { Upvote } from "@/models/upvote.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbconnect } from "@/lib/dbconnect";

// const downVoteSchema = z.object({
//   streamId: z.string(),
// });

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        { status: 404 }
      );
    }
    const data = await req.json();
    await Upvote.findOneAndDelete({
      userid: session.user.id,
      streamid: data.streamId,
    });

    await Stream.findOneAndUpdate(
      { id: data.streamId },
      { $inc: { upVotes: -1 } }
    );

    return NextResponse.json(
      { message: "Stream downvoted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error in downvoting the stream" },
      { status: 411 }
    );
  }
}

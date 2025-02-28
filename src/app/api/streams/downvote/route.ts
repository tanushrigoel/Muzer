import { Stream } from "@/models/stream.schema";
import { Upvote } from "@/models/upvote.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbconnect } from "@/lib/dbconnect";

const downVoteSchema = z.object({
  streamId: z.string(),
  userId: z.string(),
});

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
    const data = downVoteSchema.parse(await req.json());
    // const upvote = await Upvote.findOne({ userid: data.userId });
    // const stream = await Stream.findOne({ id: data.streamId });

    await Upvote.findOneAndDelete({
      userid: data.userId,
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

    // if (upvote) {
    //   return NextResponse.json(
    //     {
    //       message: "User have already voted",
    //     },
    //     { status: 401 }
    //   );
    // }
    // if (!stream) {
    //   return NextResponse.json(
    //     {
    //       message: "Stream with the given id doesn't exist",
    //     },
    //     { status: 404 }
    //   );
    // }
    // if (stream.upVotes !== undefined) {
    //   await Upvote.deleteOne({
    //     $and: [{ userid: data.userId }, { streamid: data.streamId }],
    //   });
    //   return NextResponse.json(
    //     { message: "Downvoted successfully" },
    //     { status: 200 }
    //   );
    // } else {
    //   return NextResponse.json(
    //     { error: "Error in downvoting the stream" },
    //     { status: 411 }
    //   );
    // }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error in downvoting the stream" },
      { status: 411 }
    );
  }
}

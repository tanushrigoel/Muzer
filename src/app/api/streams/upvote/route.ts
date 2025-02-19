import { Stream } from "@/models/stream.schema";
import { Upvote } from "@/models/upvote.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

const downVoteSchema = z.object({
  streamId: z.string(),
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = downVoteSchema.parse(await req.json());
    const upvote = await Upvote.findOne({ userid: data.userId });
    const stream = await Stream.findOne({ id: data.streamId });
    const session = getServerSession(authOptions);
    if(!session)
    if (upvote) {
      return NextResponse.json(
        {
          message: "User have already voted",
        },
        { status: 401 }
      );
    }
    if (!stream) {
      return NextResponse.json(
        {
          message: "Stream with the given id doesn't exist",
        },
        { status: 404 }
      );
    }
    if (stream.upVotes !== undefined) {
      let votes = stream.upVotes;
      stream.upVotes = (votes as number) + 1;
      stream.save();
      return NextResponse.json(
        { message: "Downvoted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Error in downvoting the stream" },
        { status: 411 }
      );
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error in downvoting the stream" },
      { status: 411 }
    );
  }
}

import { Stream } from "@/models/stream.schema";
import { Upvote } from "@/models/upvote.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbconnect } from "@/lib/dbconnect";

const upVoteSchema = z.object({
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
    const data = upVoteSchema.parse(await req.json());
    // const upvote = await Upvote.findOne({ userid: data.userId });
    // const stream = await Stream.findOne({ id: data.streamId });
    // const currUser = await UserModel.findOne({ email: session.user.email });
    // if (!stream) {
    //   return NextResponse.json(
    //     {
    //       message: "Stream with the given id doesn't exist",
    //     },
    //     { status: 404 }
    //   );
    // }
    const currUpvote = await Upvote.findOne({
      userid: data.userId,
      streamid: data.streamId,
    });
    if (currUpvote) {
      return NextResponse.json(
        {
          message: "User have already voted",
        },
        { status: 401 }
      );
    }
    const newUpvote = await Upvote.create({
      userid: data.userId,
      streamid: data.streamId,
    });

    await Stream.findOneAndUpdate(
      { id: data.streamId },
      { $inc: { upVotes: 1 } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Upvoted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error in upvoting the stream" },
      { status: 411 }
    );
  }
}

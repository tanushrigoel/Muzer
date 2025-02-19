import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession, User } from "next-auth";
import { dbconnect } from "@/lib/dbconnect";
import { UserModel } from "@/models/user.schema";
import { Stream } from "@/models/stream.schema";
const YT_REGEX = new RegExp(
  "^(?:https?://)?(?:www.)?(?:youtube.com/(?:watch?v=|embed/|shorts/|playlist?list=)|youtu.be/)([w-]+)"
);

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string().includes("youtube") || z.string().includes("spotify"), // only youtube or spotify allowed
});

export async function GET(req: NextRequest) {
  try {
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        {
          message: "User does not exist",
        },
        { status: 411 }
      );
    }

    const currUser = await UserModel.findOne({ id: user.id });
    if (!currUser) {
      return NextResponse.json(
        {
          message: "User not found in db",
        },
        { status: 411 }
      );
    }
    const userStreams = currUser.streams;
    return NextResponse.json(
      {
        message: "All the streams of the current user found",
        data: userStreams,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      { status: 411 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const checkUrl = YT_REGEX.test(data.url);
    if (!checkUrl) {
      return NextResponse.json(
        { error: "URL not of youtube" },
        { status: 404 }
      );
    }
    const extractedId = data.url.split("?v=");
    await dbconnect();

    await Stream.create({
      extractedid: extractedId,
      userid: data.creatorId,
      typeofstream: "Youtube",
      url: data.url,
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error while creating a stream" },
      { status: 404 }
    );
  }
}

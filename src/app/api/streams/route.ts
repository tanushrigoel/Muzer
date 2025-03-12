import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/user.schema";
import { Stream } from "@/models/stream.schema";
import ytdl from "ytdl-core";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../auth/[...nextauth]/options";
// const getSchema = z.object({
//   userid: z.string(),
// });

export async function GET(req: NextRequest) {
  try {
    await dbconnect();
    const data = req.nextUrl.searchParams.get("userid") ?? "";
    const streams = await Stream.find({ userid: data }).sort({ upVotes: -1 });
    return NextResponse.json(
      { message: "Streams of the user fetched successfully", data: streams },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Error while fetching the streams",
      },
      { status: 411 }
    );
  }
}
const CreateStreamSchema = z.object({
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const session = await getServerSession(authOptions);
    const userid = session?.user.id;

    const data = CreateStreamSchema.parse(await req.json());

    const urlCheck = ytdl.validateURL(data.url);

    if (!urlCheck) {
      return NextResponse.json(
        { error: "URL not of youtube" },
        { status: 404 }
      );
    }
    const videoId = ytdl.getURLVideoID(data.url);
    const videoInfo = await ytdl.getBasicInfo(data.url);
    const thumb = videoInfo.videoDetails.thumbnails;
    thumb.sort((a, b) => {
      return a.width - b.width && a.height - b.height;
    });

    await Stream.create({
      id: uuidv4(),
      extractedid: videoId,
      userid: userid,
      typeofstream: "Youtube",
      url: data.url,
      title: videoInfo.videoDetails.title,
      image: thumb[thumb.length - 1].url,
    });
    await UserModel.findOneAndUpdate(
      { id: userid },
      {
        $push: {
          streams: {
            extractedid: videoId,
            userid: userid,
            typeofstream: "Youtube",
            url: data.url,
            title: videoInfo.videoDetails.title,
            image: thumb[thumb.length - 1].url,
          },
        },
      }
    );

    return NextResponse.json(
      {
        message: "Stream added successfully",
        data: thumb[thumb.length - 1].url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error while creating a stream" },
      { status: 404 }
    );
  }
}

// const deleteVideoSchema = z.object({
//   id: z.string(),
// });

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  console.log(data);

  // const data = deleteVideoSchema.parse(reqdata.body);
  const session = await getServerSession(authOptions);
  const userid = session?.user.id;
  try {
    await Stream.findOneAndDelete({ id: data.id }); // stream delete from streams model
    await UserModel.findOneAndUpdate(
      { id: userid },
      { $pull: { streams: { id: data.id } } }
    ); // updating user array
    // await Upvote.findByIdAndDelete({ streamid: data.id }); // deleting all the upvotes of the particular stream
    return NextResponse.json(
      {
        message: "Stream deletion successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Some error in deleting",
      },
      { status: 501 }
    );
  }
}

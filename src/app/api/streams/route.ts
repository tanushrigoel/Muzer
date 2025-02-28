import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/user.schema";
import { Stream } from "@/models/stream.schema";
import ytdl from "ytdl-core";


const getSchema = z.object({
  userid: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    await dbconnect();
    const data = req.nextUrl.searchParams.get("userid") ?? "";
    const streams = await Stream.find({ userid: data });
    return NextResponse.json(
      { message: "Streams of the user fetched successfully", data: streams },
      { status: 200 }
    );
    
    
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while fetching the streams",
      },
      { status: 411 }
    );
  }
}
const CreateStreamSchema = z.object({
  userid: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await dbconnect();

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
    // console.log(videoInfo.videoDetails.thumbnail);
    const thumb = videoInfo.videoDetails.thumbnails;
    thumb.sort((a, b) => {
      return a.width - b.width && a.height - b.height;
    });
    // console.log(thumb[thumb.length - 1].url);

    await Stream.create({
      extractedid: videoId,
      userid: data.userid,
      typeofstream: "Youtube",
      url: data.url,
      title: videoInfo.videoDetails.title,
      image: thumb[thumb.length - 1].url,
    });
    await UserModel.findOneAndUpdate(
      { id: data.userid },
      {
        $push: {
          streams: {
            extractedid: videoId,
            userid: data.userid,
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

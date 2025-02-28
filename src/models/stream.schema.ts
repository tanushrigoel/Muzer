import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IStream } from "./types";

export const streamSchema = new Schema<IStream>({
  typeofstream: {
    type: String,
    enum: ["Spotify", "Youtube"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  id: {
    type: String,
    default: uuidv4(),
  },
  upVotes: {
    type: Number,
    default: 0,
  },
  extractedid: {
    type: String,
  },
  userid: {
    type: String,
  },
  url: {
    type: String,
  },
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
});

const Stream = mongoose.models.Stream || mongoose.model("Stream", streamSchema);

export { Stream };

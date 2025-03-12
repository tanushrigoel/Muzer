import mongoose, { Schema } from "mongoose";

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
    required: true,
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

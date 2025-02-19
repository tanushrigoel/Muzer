import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUser, userSchema } from "./user.schema";
import { Iupvote, upvoteSchema } from "./upvote.schema";

export interface IStream {
  _id: mongoose.Types.ObjectId;
  typeofstream: String;
  active: Boolean;
  extractedid?: String;
  upVotes?: Number;
  id: String;
  userid: String;
  url?: String;
}

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
});
const Stream = model("Stream", streamSchema);

export { Stream };

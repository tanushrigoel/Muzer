import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Iupvote {
  _id: mongoose.Types.ObjectId;
  id: String;
  userid: String;
  streamid: String;
}

export const upvoteSchema = new Schema<Iupvote>({
  id: {
    type: String,
    default: uuidv4(),
  },
  userid: {
    type: String,
    unique: true,
  },
  streamid: {
    type: String,
  },
});

export const Upvote = model("Upvote", upvoteSchema);

import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Iupvote } from "./types";


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

export const Upvote = mongoose.models.Upvote || model("Upvote", upvoteSchema);

import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IStream, streamSchema } from "./stream.schema";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  id: string;
  role: string;
  streams?: IStream[];
}

export const userSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: uuidv4(),
    required: true,
  },
  role: {
    type: String,
    enum: ["Streamer", "EndUser"],
  },
  streams: {
    type: [streamSchema],
  },
});

const User = model("User", userSchema);

export { User };

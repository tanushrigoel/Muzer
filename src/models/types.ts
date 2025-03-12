import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  id: string;
  streams?: IStream[];
}

export interface IStream {
  _id: mongoose.Types.ObjectId;
  typeofstream: string;
  active: boolean;
  extractedid: string;
  upVotes: number;
  id: string;
  userid: string;
  url?: string;
  title?: string;
  image?: string;
}

export interface Iupvote {
  _id: mongoose.Types.ObjectId;
  id: string;
  userid: string;
  streamid: string;
}

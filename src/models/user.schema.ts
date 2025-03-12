import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./types"; // Import from new types file
import { streamSchema } from "./stream.schema"; // Import only after defining the schema

const userSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: uuidv4(),
    required: true,
  },
  streams: {
    type: [streamSchema], // Now properly defined
    default: [],
  },
});

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
export default UserModel;

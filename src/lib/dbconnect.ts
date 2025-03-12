import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
// console.log(MONGODB_URI);

// if (MONGODB_URI.length == 0) {
//   throw new Error("Please define the mongodb string");
// }

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbconnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.log("db error", error);
    throw new Error("Check db file");
  }
  return cached.conn;
}

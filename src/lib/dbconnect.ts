const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the mongodb string");
}

let cached = global.mongoose;

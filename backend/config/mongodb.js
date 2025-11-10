import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  const raw = process.env.MONGODB_URI || process.env.MONGODB_URL || "";
  let uri = raw.trim();

  if (!uri) {
    uri = "mongodb://127.0.0.1:27017/trendify";
  } else if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    if (uri.startsWith("localhost") || uri.startsWith("127.0.0.1")) {
      if (!uri.includes("://")) {
        uri = `mongodb://${uri}`;
      }
    } else {
      throw new Error(
        'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://". Received: ' + raw
      );
    }
  }

  const normalized = uri.replace(/\/+$/, "");
  const hasDb = /\/[^/?#]+(\?|$)/.test(normalized);
  if (!hasDb) {
    uri = normalized + "/trendify";
  } else {
    uri = normalized;
  }

  await mongoose.connect(uri);
};

export default connectDB;

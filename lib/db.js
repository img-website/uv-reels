import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
    });
    console.log("Connected ");
  } catch (err) {
    console.log("Error in connecting preetam: ", err);
    throw new Error("Error: ", err);
  }
};

export default connect;

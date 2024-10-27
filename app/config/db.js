import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });

let DB_URI = "";

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DB_URI_TEST;
} else if (process.env.NODE_ENV === "dev") {
  DB_URI = process.env.DB_URI_DEV;
} else {
  DB_URI = process.env.DB_URI;
}

const conectionDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }
};

export default conectionDB;

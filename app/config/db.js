import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });
const { DB_URI } = process.env;

const conectionDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Base de datos conectada");
  } catch (error) {
    console.error(error);
  }
};

export default conectionDB;

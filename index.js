import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import conectionDB from "./app/config/db.js";

dotenv.config();
const { PORT } = process.env || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  conectionDB();
  console.log(`Server escuchando en puerto ${PORT}`);
});

export default app;

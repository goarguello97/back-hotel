import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import conectionDB from "./app/config/db.js";
import router from "./app/routes/index.js";

dotenv.config();
const { PORT } = process.env || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  conectionDB();
  console.log(`Server escuchando en puerto ${PORT}`);
});

export { app };

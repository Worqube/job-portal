import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./controllers/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json());

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
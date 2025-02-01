import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { Details, NewDetail, NewUser } from "./controllers/Details.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json());

app.post('/users', NewUser);
app.post('/users/:userId/details', NewDetail);
app.get('/users/:userId/details', Details)

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use('/users', userRoutes)
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
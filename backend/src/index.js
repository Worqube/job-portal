import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'https://worqube.netlify.app',
    credentials: true,
    allowedHeaders: {
        "Access-Control-Allow-Origin": "https://worqube.netlify.app",
        "Access-Control-Allow-Credentials": true,
    }
}))

app.use('/users', userRoutes);
app.use('admin', adminRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
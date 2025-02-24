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
    origin: 'https://warm-genie-7e847b.netlify.app',
    credentials: true,
}))

app.use('/users', userRoutes);
app.use('admin', adminRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
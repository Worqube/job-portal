import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import jobRoutes from './routes/job.routes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://worqube.onrender.com', 'http://localhost:5173'],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}))

app.use('/users', userRoutes);
app.use('admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);

app.listen(PORT, () => {
    console.log("Server is connected. PORT:", PORT);
    connectDB();
})
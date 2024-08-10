import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: ['http://localhost:5173','http://10.42.0.219:5173','*'], 
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Route import
import { router } from './router/users.routes.js';
import {taskRouter} from './router/task.management.routes.js';
app.use("/api/auth", router);
app.use("/api/task-management",taskRouter)

export { app };

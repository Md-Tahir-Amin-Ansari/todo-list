/**
 * @file app.ts
 * @brief Configured Express application instance for HTTP routing and testing.
 */
import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRoutes.ts';
import { todosRouter } from './routes/todoRoutes.ts';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/todos', todosRouter);

export default app;
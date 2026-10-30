import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRoutes.ts';
import { todosRouter } from './routes/todoRoutes.ts';

// creates express application
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/auth', authRouter);
app.use('/todos', todosRouter);

//  server start
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import userRouter from './components/user/router';
import videoRouter from './components/video/router';
import initBullWorker from './worker/init';
import { createOrGetDbConnection, createTable } from './config/database';
import videoQueue from './queue/video-queue';
const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function startServer() {
  videoQueue.drain();
  const bullmqWorker = initBullWorker();
  const db = await createOrGetDbConnection();
  createTable(db);
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}

startServer();

export default app;
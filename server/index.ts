import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import userRouter from './components/user/router';
import videoRouter from './components/video/router';
import initBullWorker from './worker/init';
import { createOrGetDbConnection, createTable } from './config/database';
import videoQueue from './queue/video-queue';
import type { Worker } from 'bullmq';

const app = express();
let PORT = process.env.PORT || 3000;
let bullmqWorker: Worker;
app.use(express.json());
app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function startServer() {
  videoQueue.drain();
  bullmqWorker = initBullWorker();
  const db = await createOrGetDbConnection();
  createTable(db);
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}

process.on('SIGTERM', async () => {
  await closeServer();
})


startServer();

export async function closeServer() {
  await videoQueue.close();
  await bullmqWorker.close();
}

export default app;
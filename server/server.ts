import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import userRouter from './components/user/router';
import videoRouter from './components/video/router';
import { createOrGetDbConnection, createTable } from './config/database';
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
  const db = await createOrGetDbConnection();
  createTable(db);
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}

startServer();

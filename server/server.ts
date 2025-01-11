import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';

const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function startServer() {

  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}

startServer();

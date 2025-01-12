
import path from 'node:path';
import { Job, Worker } from 'bullmq';
import { connection, VIDEO_QUEUE_NAME } from '../queue/video-queue';
import { updateVideoJob } from '../components/video/repository';

function initBullWorker() {
  let bullmqWorker = new Worker("dummy-queue", async job => { }, { connection });//for testing
  if (process.env.NODE_ENV !== 'test') {
    bullmqWorker = new Worker(
      VIDEO_QUEUE_NAME,
      path.join(__dirname, 'video-worker.js'),
      { connection, useWorkerThreads: true }
    );

    bullmqWorker.on('completed', async (job: Job) => {
      console.log("job completed", job.id);
      await updateVideoJob(job.id as string, "completed");
    });
  }
  return bullmqWorker;
}

export default initBullWorker;
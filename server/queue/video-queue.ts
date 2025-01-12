import { Queue } from 'bullmq'
export const connection = {
  host: "127.0.0.1",
  port: 6379,
};
export const VIDEO_QUEUE_NAME = "video-operations";
const videoQueue = new Queue(VIDEO_QUEUE_NAME, { connection });

export default videoQueue;
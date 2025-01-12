import path from 'node:path';
import { getVideos, insertVideoJob } from "./repository";
import videoQueue from '../../queue/video-queue';
import { VideoNotFoundError } from '../../utils/error';
import { VideoModel } from '../../@types/video';
import { MergeJobData, TrimJobData } from '../../@types/job';

async function createTrimJob(userId: number, videoId: number, startTime: string, duration: string) {
  const requestedVideo = await validateVideoOwnership(userId, videoId);
  const jobData = prepareTrimJobData(requestedVideo[0], startTime, duration);

  return await enqueueTrimJob(jobData);
}

async function validateVideoOwnership(userId: number, videoId: number) {
  const videos = await getVideos(userId);
  const requestedVideo = videos.filter((video) => video.id === videoId);
  if (requestedVideo.length === 0) {
    throw new VideoNotFoundError("Video not found");
  }
  return requestedVideo;
}

function prepareTrimJobData(video: VideoModel, startTime: string, duration: string): TrimJobData {
  return {
    inputPath: path.join(process.cwd(), 'uploads', video.path),
    outputPath: path.join(process.cwd(), 'output', `trimmed-${video.path}`),
    startTime,
    duration,
    type: 'trim',
  };
}

async function enqueueTrimJob(jobOptions: TrimJobData) {
  const job = await videoQueue.add("trim", jobOptions, { removeOnComplete: true, removeOnFail: true });
  return await insertVideoJob(job.id as string, jobOptions.outputPath, "pending");
}


async function createMergeJob(userId: number, videoIds: Array<number>) {
  const result = await getVideos(userId, videoIds);
  const videoPaths = result.map((video) => {
    return path.join(process.cwd(), 'uploads', video.path);
  });

  if (videoPaths.length === 0) {
    throw new VideoNotFoundError("Video not found ");
  }
  const jobData = prepareMergeJobData(videoPaths, result);
  return await enqueueMergeJob(jobData);
}

function prepareMergeJobData(inputVideoPaths: Array<string>, storedVideoPath: Array<VideoModel>): MergeJobData {
  return {
    videoPaths: inputVideoPaths,
    outputPath: path.join(process.cwd(), 'output', `merged-${storedVideoPath[0].path}`),
    type: 'merge'
  }
}

async function enqueueMergeJob(jobData: MergeJobData) {
  const job = await videoQueue.add("merge", jobData, { removeOnComplete: true, removeOnFail: true });
  return await insertVideoJob(job.id as string, jobData.outputPath, "pending");

}

export { createTrimJob, createMergeJob, validateVideoOwnership };
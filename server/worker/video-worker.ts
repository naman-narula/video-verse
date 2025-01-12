import { trimVideo, mergeVideos } from '../components/video/video-operations';
import { MergeJob, TrimJob } from '../@types/job';

export default async function (job: TrimJob | MergeJob) {
    switch (job.data.type) {
        case 'trim':
            console.log("trimming", job.data);
            await trimVideo(job.data.inputPath, job.data.outputPath, job.data.startTime, job.data.duration);
            break;
        case 'merge':
            console.log("merging");
            await mergeVideos(job.data.videoPaths, job.data.outputPath);
            break;
        default:
            console.log("no job found");
    }
}
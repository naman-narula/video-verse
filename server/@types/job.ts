import { Job } from "bullmq";

export type TrimJobData = {
    inputPath: string,
    outputPath: string,
    startTime: string,
    duration: string,
    type: 'trim'
}

export interface TrimJob extends Job {
    data: TrimJobData
}

export type MergeJobData = {
    videoPaths:Array<string>, 
    outputPath:string,
    type: 'merge'
}

export interface MergeJob extends Job {
    data: MergeJobData
}

export type VideoJobModel = {
    id:number,
    status:"completed" | "pending",
    job_id:string,
    path:string,
}
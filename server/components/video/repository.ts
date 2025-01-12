import { RunResult } from 'sqlite3';
import { createOrGetDbConnection } from '../../config/database';
import { VIDEO_JOB_TABLENAME, VIDEO_TABLENAME } from '../../constants';
import type { VideoModel } from '../../@types/video';
import { VideoJobModel } from '../../@types/job';

async function insertVideo(userId: number, filepath: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`INSERT INTO ${VIDEO_TABLENAME} (path,user_id) VALUES (?,?)`);
    stmt.run([filepath, userId],
      function (this: RunResult, err: Error) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

async function getVideos(userId: number, videoIds?: Array<number>): Promise<Array<VideoModel>> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();
    let stmt;
    if (videoIds) {
      stmt = db.prepare(`SELECT * FROM ${VIDEO_TABLENAME} WHERE user_id = ? and id IN (${videoIds.toString()})`);
    }
    stmt = db.prepare(`SELECT * FROM ${VIDEO_TABLENAME} WHERE user_id = ?`);
    stmt.all(userId,
      function (err: Error, row: Array<VideoModel>) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

async function insertVideoJob(jobId:string,path:string,status:string):Promise<number> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`INSERT INTO ${VIDEO_JOB_TABLENAME} (status,job_id,path) VALUES (?,?,?)`);
    stmt.run([status, jobId,path],
      function (this: RunResult, err: Error) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

async function updateVideoJob(jobId:string,status:string):Promise<number> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`UPDATE ${VIDEO_JOB_TABLENAME} SET status = ? WHERE job_id = ?`);
    stmt.run([status,jobId],
      function (this: RunResult, err: Error) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

async function getVideoJob(rowId:string): Promise<VideoJobModel>{
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`SELECT * FROM ${VIDEO_JOB_TABLENAME} where id = ?`);
    stmt.get(rowId,
      function (err: Error, row: any) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

export { insertVideo, getVideos,insertVideoJob,getVideoJob,updateVideoJob};
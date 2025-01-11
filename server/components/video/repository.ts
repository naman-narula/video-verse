import { RunResult } from 'sqlite3';
import { createOrGetDbConnection } from '../../config/database';
import {  VIDEO_TABLENAME } from '../../constants';
import type { VideoModel } from '../../@types/video';


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


export { insertVideo, getVideos};
import sqlite3, { Database } from 'sqlite3';
import { USER_TABLENAME, VIDEO_JOB_TABLENAME, VIDEO_TABLENAME } from '../constants';

const filepath = './video_verse.db';

var db: Database;
async function createOrGetDbConnection(): Promise<Database> {
  return new Promise((resolve, reject) => {
    if (db === undefined) {
      db = new Database(filepath, (err) => {
        if (err) {
          reject(err.message);
        }
      });
      sqlite3.verbose();
    }
    resolve(db);
  });
}

function createTable(dbInstance: Database) {
  dbInstance.serialize(() => {
    dbInstance.run(
      `CREATE TABLE IF NOT EXISTS ${USER_TABLENAME} (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT);`
    );

    dbInstance.run(
      `CREATE TABLE IF NOT EXISTS ${VIDEO_TABLENAME}  (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))`
    );

    dbInstance.run(
      `CREATE TABLE IF NOT EXISTS ${VIDEO_JOB_TABLENAME} (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, job_id TEXT, path TEXT )`
    );
  });
}

export { createOrGetDbConnection , createTable };

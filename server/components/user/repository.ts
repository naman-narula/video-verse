import { RunResult } from 'sqlite3';
import { createOrGetDbConnection } from '../../config/database';
import { USER_TABLENAME } from '../../constants';
import { UserModel } from '../../@types/user';

async function insertUser(username: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`INSERT INTO ${USER_TABLENAME} (username) VALUES (?)`);
    stmt.run(username,
      function (this:RunResult,err: Error) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}
async function userExists(userId: number): Promise<UserModel> {
  return new Promise(async (resolve, reject) => {
    const db = await createOrGetDbConnection();

    const stmt = db.prepare(`SELECT * FROM ${USER_TABLENAME} WHERE id = ?`);
    stmt.get(userId,
      function (err: Error, row:UserModel) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}


export { insertUser,userExists };

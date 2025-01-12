import request from 'supertest';
import app from '../server'; // Adjust the path if needed

export const createUser = async (username: string) => {
  return await request(app)
    .post('/user/signup')
    .send({ username })
    .expect(200);
};

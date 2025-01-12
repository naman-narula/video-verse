import request from 'supertest';
import app, { closeServer } from '../server';
import { createUser } from './testHelpers';
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { createOrGetDbConnection, createTable } from '../server/config/database';
import path from 'node:path'

let token: string;

beforeAll(async () => {
  // Create a user to get the JWT token
  const response = await createUser('naman');
  token = response.body.data;
  const db = await createOrGetDbConnection();
  createTable(db);
});

afterAll(async () => {
  await closeServer();
});

describe('Videoverse API End-to-End Tests', () => {

  test('Signup - POST /user/signup', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({ username: 'naman' })
      .expect(200);

    expect(res.body.code).toBe(200);
    expect(res.body.message).toBe('');
    expect(res.body.message).toBe('');

    expect(res.body.data).toBeDefined();

    const token = res.body.data;
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const decoded = jwt.verify(token, process.env.TOKEN as string);
    expect(decoded).toBeDefined();
    expect((decoded as any).username).toBe('naman');
  });

  test('Upload File - POST /video/upload', async () => {
    const res = await request(app)
      .post('/video/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('video', path.resolve(__dirname, 'small.mp4')) // Replace with actual file path
      .expect(201);

    await request(app)
      .post('/video/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('video', path.resolve(__dirname, 'small.mp4')) // Replace with actual file path
      .expect(201);

    expect(res.body.code).toBe(201);
    expect(res.body.message).toBe('Video uploaded successfully');
    expect(res.body.data).toBe(true); // true if upload succeeded
  });

  test('Get Videos - GET /video', async () => {
    const res = await request(app)
      .get('/video')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.code).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array<{
      id: number,
      path: string,
      "user_id": number
    }>);
    expect(res.body.data[0]).toMatchObject({
      id: expect.any(Number),
      path: expect.stringMatching(/^video-\d+-\d+\.mp4$/),
      user_id: expect.any(Number),
    });
  });

  test('Generate Link - GET /video/link/generate/:id', async () => {
    const videosRes = await request(app)
      .get('/video')
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .get(`/video/link/generate/${videosRes.body.data[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.code).toBe(200);
    expect(res.body.message).toBe('');
    expect(res.body.data).toHaveProperty('link');
  });

  test('Trim Video - POST /video/trim/:id', async () => {
    const videosRes = await request(app)
      .get('/video')
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .post(`/video/trim/${videosRes.body.data[0].id}`) // Replace with an actual video ID
      .set('Authorization', `Bearer ${token}`)
      .send({
        startTime: '00:00:02',
        duration: '00:00:04'
      })
      .expect(202);
    processedId = res.body.data;
    expect(res.body.code).toBe(202);
    expect(res.body.message).toBe('');
    expect(res.body.data).toBeGreaterThan(0); // Assuming job id is 0 for now
  });
  test('Merge Videos - POST /video/merge', async () => {
    const videosRes = await request(app)
      .get('/video')
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .post('/video/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ videoIds: [videosRes.body.data[0].id, videosRes.body.data[1].id] })
      .expect(202);

    expect(res.body.code).toBe(202);
    expect(res.body.message).toBe('Videos merged successfully');
    expect(res.body.data).toBeGreaterThan(0);
  });

  test('Get Processed Video - GET /video/processed/:jobId', async () => {
    const res = await request(app)
      .get(`/video/processed/${processedId}`) // Replace with actual job ID
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  let processedId: number;
});

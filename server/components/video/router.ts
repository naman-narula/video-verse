import { Router } from 'express';

import linkRouter from './links/router';
import { authenticateToken } from '../../middlewares/auth';
import upload from '../../config/multer';
import { validateSize, validateVideoDuration } from './validation';
import { insertVideo, getVideos, getVideoJob } from './repository';
import { createMergeJob, createTrimJob } from './service';
import { VideoNotFoundError } from '../../utils/error';
import prepareResponse from '../../utils/response';

const router = Router();

router.use('/link', linkRouter);
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const result = await getVideos(req.user.userId);
  res.status(200).json(prepareResponse(200, "", result));
});

router.post('/upload', upload.single('video'), async (req, res, next) => {
  if (validateSize(req.file!.size) === false) {
    res.status(400).json(prepareResponse(400, 'File size exceeds size of 25 MB.'));
  }
  try {

    const result = await validateVideoDuration(req.file!.path);
    if (result === true) {
      await insertVideo(req.user.userId, req.file!.filename);
    }
    res.status(201).json(prepareResponse(201, "Video uploaded successfully", result));
  }
  catch (err) {
    next(err);
  }
});

router.post('/trim/:id', async (req, res) => {
  try {
    const { startTime, duration } = req.body;
    const id = await createTrimJob(req.user.userId, Number.parseInt(req.params.id), startTime, duration)
    res.status(202).json(prepareResponse(202, "", id));
  } catch (error) {
    if (error instanceof VideoNotFoundError) {
      res.status(error.code).json(prepareResponse(error.code, error.message))
    }
    console.error(error);
  }
});

router.post('/merge/', async (req, res) => {
  try {
    const { videoIds } = req.body;
    const id = await createMergeJob(req.user.userId, videoIds);
    res.status(202).json(prepareResponse(202, "Videos merged successfully", id));
  } catch (error) {
    if (error instanceof VideoNotFoundError) {
      res.status(error.code).json(prepareResponse(error.code, error.message))
    }
    console.error(error);
  }
})

router.get('/processed/:jobId', async (req, res, next) => {
  const jobId = req.params.jobId;
  try {
    const result = await getVideoJob(jobId);
    if (result.status === "completed") {
      res.sendFile(result.path);
    }
    else {
      res.status(200).json(prepareResponse(200, "", result.status));
    }
  }
  catch (err) {
    next(err);
  }

})

export default router;

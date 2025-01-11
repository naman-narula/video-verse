import { Router } from 'express';


import { authenticateToken } from '../../middlewares/auth';
import upload from '../../config/multer';
import { validateSize, validateVideoDuration } from './validation';
import { insertVideo, getVideos } from './repository';


const router = Router();


router.use(authenticateToken);

router.get('/', async (req, res) => {
  const result = await getVideos(req.user.userId);
  res.status(200).json(result);
});

router.post('/upload', upload.single('video'), async (req, res, next) => {
  if (validateSize(req.file!.size) === false) {
    res.status(400).json({ error: 'File size exceeds size of 25 MB.' });
  }
  try {

    const result = await validateVideoDuration(req.file!.path);
    if (result === true) {
      await insertVideo(req.user.userId, req.file!.filename);
    }
    res.status(201).json({ message: result });
  }
  catch (err) {
    next(err);
  }
});


export default router;

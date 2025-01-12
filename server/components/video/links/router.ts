import path from 'path'
import { Router } from "express";
import { getVideos } from "../repository";
import { authenticateToken } from "../../../middlewares/auth";
import {generateLink,verifyLink} from './link-utils';
import { validateVideoOwnership } from '../service';
import prepareResponse from '../../../utils/response';

const router = Router();

const filesDirectory = path.join(process.cwd(), 'uploads');

router.get('/:filename', (req, res ) => {
  const { filename } = req.params;
  const { expires, signature } = req.query;
  const isLinkValid = verifyLink(filename,expires as string,signature as string);
  if( !isLinkValid){
    res.status(403).json(prepareResponse(403,"Invalid link"));
    return;
  }
  const filePath = path.join(filesDirectory, filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json(prepareResponse(404,"file not found"));
    }
  });
});

router.get('/generate/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  const result = await validateVideoOwnership(req.user.userId,Number.parseInt(id));
  const link = await generateLink(result[0].path);
  res.status(200).json(prepareResponse(200,"",link));
});

export default router;
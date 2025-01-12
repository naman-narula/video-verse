import path from 'path'
import { Router } from "express";
import { authenticateToken } from "../../../middlewares/auth";
import { generateLink, verifyLink } from './link-utils';
import { validateVideoOwnership } from '../service';
import prepareResponse from '../../../utils/response';
import { VideoNotFoundError } from '../../../utils/error';
import { validateRequest,validateParams } from '../../../middlewares/validation';
import idFileParamSchema from './joi-validation';
import { idParamSchema } from '../../../utils/joi-validation';

const router = Router();

const filesDirectory = path.join(process.cwd(), 'uploads');

router.get('/:filename', validateParams(idFileParamSchema), (req, res) => {
  const { filename } = req.params;
  const { expires, signature } = req.query;
  const isLinkValid = verifyLink(filename, expires as string, signature as string);
  if (!isLinkValid) {
    res.status(403).json(prepareResponse(403, "Invalid link"));
    return;
  }
  const filePath = path.join(filesDirectory, filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json(prepareResponse(404, "file not found"));
    }
  });
});

router.get('/generate/:id', validateParams(idParamSchema), authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await validateVideoOwnership(req.user.userId, Number.parseInt(id));
    const link = await generateLink(result[0].path);
    res.status(200).json(prepareResponse(200, "", link));
  } catch (error) {
    if (error instanceof VideoNotFoundError) {
      res.status(error.code).json(prepareResponse(error.code, error.message))
    }
    console.error(error);
  }
});

export default router;
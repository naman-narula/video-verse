import { Router } from 'express';
import { generateAccessToken } from '../../middlewares/auth';
import { insertUser } from './repository';
import prepareResponse from '../../utils/response';

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        const userId = await insertUser(req.body.username);
        const token = generateAccessToken(userId,req.body.username);
        res.status(200).json(prepareResponse(200,"",token));
    }
    catch (err) {
        next(err)
    }
});

export default router;

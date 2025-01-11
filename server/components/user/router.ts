import { Router } from 'express';
import { generateAccessToken } from '../../middlewares/auth';
import { insertUser } from './repository';

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        const userId = await insertUser(req.body.username);
        const token = generateAccessToken(userId);
        res.status(200).json(token);
    }
    catch (err) {
        next(err)
    }
});

export default router;

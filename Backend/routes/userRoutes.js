import express from 'express';
import { getUserData } from '../controllers/userController.js';
import { userAuth } from '../middleware/userAuth.js';

const userRouter = express.Router();

// protected route - userAuth attaches req.userId and req.user
userRouter.get('/data', userAuth, getUserData);

export default userRouter;
import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import meRouter from './me';
import organizationsRouter from './organizations';
import usersRouter from './users';
import projectsRouter from './projects';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/me', meRouter);
router.use('/organizations', organizationsRouter);
router.use('/users', usersRouter);
router.use('/projects', projectsRouter);

export default router;

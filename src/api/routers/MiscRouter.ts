import { Router } from 'express';
import { IRouter } from '../Restful';

const router = Router();

router.get('/health', (req, res) => {
  res.sendStatus(200);
});

export default {
  router,
  routeName: '/',
} as IRouter;

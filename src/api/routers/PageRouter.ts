import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { IRouter } from '../Restful';

const router = Router();

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/redirect', passport.authenticate('discord', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/login', passport.authenticate('discord', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/logout', checkAuth, (req, res) => {
  req.session?.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

router.get('/',
  checkAuth,
  (req, res) => {
    res.json({ status: 'Logged in', id: (<any>req.user).id });
  });

export default {
  router,
  routeName: '/',
} as IRouter;

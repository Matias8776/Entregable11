import { Router } from 'express';
import {
  current,
  failLogin,
  failRegister,
  github,
  githubCallback,
  login,
  logout,
  passportCurrent,
  passportGithub,
  passportGithubCallback,
  passportLogin,
  passportRegister,
  register,
  resetPassword
} from '../controllers/sessions.js';

const router = Router();

router.post('/login', passportLogin, login);

router.get('/faillogin', failLogin);

router.post('/register', passportRegister, register);

router.get('/failregister', failRegister);

router.get('/logout', logout);

router.get('/github', passportGithub, github);

router.get('/githubcallback', passportGithubCallback, githubCallback);

router.post('/resetPassword', resetPassword);

router.get('/current', passportCurrent, current);

export default router;

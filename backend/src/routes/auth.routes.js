import express from 'express';
import { alogin, asignup, checkAuth, login, logout, signup, verify } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/adminsignup', asignup);
router.post('/login', login);
router.post('/adminlogin', alogin);
router.post('/logout', logout);
router.post('/verify/:reg_id', verify);
router.get('/check', protectRoute, checkAuth);

export default router;
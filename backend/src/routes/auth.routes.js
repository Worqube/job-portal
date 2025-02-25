import express from 'express';
import { alogin, asignup, checkAuth, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/adminsignup', asignup);
router.post('/login', login);
router.post('/adminlogin', alogin);
router.post('/logout', logout);
router.get('/check', checkAuth);

export default router;
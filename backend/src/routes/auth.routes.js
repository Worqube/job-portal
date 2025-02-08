import express from 'express';
import { checkAuth, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.get('/check', protectRoute, checkAuth);
// router.post('/login', login);
// router.post('/logout', logout);
// router.put('/update-profile', protectRoute, updateProfile);
// router.get('/check', protectRoute, checkAuth);



export default router;
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateUserDetails, updateUserProfile, userDetails, userProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userProfile);
router.get('/details', userDetails);
router.post('/', updateUserProfile);
router.post('/details', updateUserDetails);
// router.post('/login', login);
// router.post('/logout', logout);
// router.put('/update-profile', protectRoute, updateProfile);
// router.get('/check', protectRoute, checkAuth);



export default router;
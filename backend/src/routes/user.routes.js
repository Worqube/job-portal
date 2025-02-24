import express from 'express';
import { updateUserDetails, updateUserProfile, userDetails, userProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userProfile);
router.get('/details', userDetails);
router.post('/', updateUserProfile);
router.post('/details', updateUserDetails);



export default router;
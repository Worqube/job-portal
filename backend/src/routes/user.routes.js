import express from 'express';
import { editProfile, loadData, updateUserDetails, updateUserProfile, userDetails, userProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userProfile);
router.get('/details', userDetails);
router.post('/', updateUserProfile);
router.post('/details', updateUserDetails);
router.post('/loadData', loadData);
router.post('/editProfile/:reg_id', editProfile);


export default router;
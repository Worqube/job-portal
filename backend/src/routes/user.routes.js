import express from 'express';
import { editProfile, loadData, updateUserDetails, updateUserProfile, userDetails, userProfile, upload } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userProfile);
router.get('/details', userDetails);
router.post('/', updateUserProfile);
router.post('/details', updateUserDetails);
router.post('/loadData', loadData);
router.put('/editProfile/:reg_id', upload, editProfile);


export default router;
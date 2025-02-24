import express from 'express';
import { addAdminDetails, adminDetails, adminProfile } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', adminProfile);
router.get('/details', adminDetails);
router.post('/', addAdminDetails);



export default router;
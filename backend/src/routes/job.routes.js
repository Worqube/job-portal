import express from 'express';
import { jobAdd, jobApply, jobDisplay } from '../controllers/job.controller.js';

const router = express.Router();

router.get('/', jobDisplay);
router.post('/apply', jobApply);
router.post('/add', jobAdd);

export default router;
import express from 'express';
import { createJobs, getJobs, updateJob, deleteJob } from '../Controllers/jobsController.js';

const router = express.Router();

// Route to create a new job
router.post('/jobs', createJobs);

// Route to get all jobs
router.get('/jobs', getJobs);

// Route to update a job
router.put('/jobs/:id', updateJob);

// Route to delete a job
router.delete('/jobs/:id', deleteJob);

export default router;

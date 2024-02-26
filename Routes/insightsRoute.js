import express from 'express';
import { addInsight, getAllInsight, getOneInsight, updateInsight, deleteInsight } from '../Controllers/insightsController.js';

const router = express.Router();

// Route to create a new insight
router.post('/insights', addInsight);

// Route to get all insights
router.get('/insights', getAllInsight);

// Route to get a single insight by ID
router.get('/insights/:id', getOneInsight);

// Route to update an insight
router.put('/insights/:id', updateInsight);

// Route to delete an insight
router.delete('/insights/:id', deleteInsight);

export default router;

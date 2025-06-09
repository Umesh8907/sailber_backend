import express from 'express';
import { getAvailableRides } from '../controllers/rideController.js';

const router = express.Router();
router.post('/available', getAvailableRides);

export default router;

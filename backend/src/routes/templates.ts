import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import {
  getTemplates,
  createFromTemplates,
  initializeDefaultHabits
} from '../controllers/templateController';

const router = express.Router();

// Public route to get templates
router.get('/', getTemplates);

// Protected routes
router.post(
  '/initialize',
  authenticateToken,
  initializeDefaultHabits
);

router.post(
  '/create',
  authenticateToken,
  body('templateNames').isArray(),
  createFromTemplates
);

export default router;

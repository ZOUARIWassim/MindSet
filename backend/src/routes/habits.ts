import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  logHabitEntry,
  getHabitEntries,
  getTodayEntries,
  getEntriesByDateRange,
  getHabitStats
} from '../controllers/habitController';

const router = express.Router();

// All habit routes require authentication
router.use(authenticateToken);

// Validation rules
const createHabitValidation = [
  body('name').trim().notEmpty().withMessage('Habit name is required').isLength({ min: 2, max: 100 }),
  body('category').isIn(['workout', 'nutrition', 'spiritual', 'personal', 'other']),
  body('type').isIn(['boolean', 'numeric', 'duration', 'text']),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly']),
  body('target').optional().isNumeric().withMessage('Target must be a number'),
  body('unit').optional().isLength({ max: 20 })
];

const updateHabitValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('category').optional().isIn(['workout', 'nutrition', 'spiritual', 'personal', 'other']),
  body('type').optional().isIn(['boolean', 'numeric', 'duration', 'text']),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly']),
  body('target').optional().isNumeric(),
  body('active').optional().isBoolean()
];

const logEntryValidation = [
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('value').optional(),
  body('notes').optional().isLength({ max: 500 })
];

// Routes

// Get all user habits
router.get('/', getUserHabits);

// Get today's entries
router.get('/entries/today', getTodayEntries);

// Get entries for a date range (calendar view)
router.get('/entries/range',
  query('startDate').isISO8601().withMessage('startDate must be ISO8601'),
  query('endDate').isISO8601().withMessage('endDate must be ISO8601'),
  getEntriesByDateRange
);

// Create a new habit
router.post('/', createHabitValidation, createHabit);

// Get a single habit
router.get('/:habitId', param('habitId').isMongoId(), getHabitById);

// Update a habit
router.put('/:habitId', param('habitId').isMongoId(), updateHabitValidation, updateHabit);

// Delete a habit
router.delete('/:habitId', param('habitId').isMongoId(), deleteHabit);

// Log habit entry (completion)
router.post('/:habitId/entries', param('habitId').isMongoId(), logEntryValidation, logHabitEntry);

// Get habit entries (history)
router.get(
  '/:habitId/entries',
  param('habitId').isMongoId(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  getHabitEntries
);

// Get habit statistics
router.get(
  '/:habitId/stats',
  param('habitId').isMongoId(),
  query('days').optional().isInt({ min: 1, max: 365 }),
  getHabitStats
);

export default router;

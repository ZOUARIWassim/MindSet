import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { templateService } from '../services/templateService';

// Get all habit templates
export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = templateService.getTemplates();
    res.status(200).json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Server error fetching templates' });
  }
};

// Create habits from selected templates
export const createFromTemplates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { templateNames } = req.body;

    if (!Array.isArray(templateNames)) {
      res.status(400).json({ error: 'templateNames must be an array' });
      return;
    }

    await templateService.createFromTemplates(userId, templateNames);

    res.status(201).json({ message: 'Habits created from templates successfully' });
  } catch (error) {
    console.error('Create from templates error:', error);
    res.status(500).json({ error: 'Server error creating habits from templates' });
  }
};

// Initialize default habits for user
export const initializeDefaultHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    await templateService.createDefaultHabits(userId);

    res.status(201).json({ message: 'Default habits initialized successfully' });
  } catch (error) {
    console.error('Initialize default habits error:', error);
    res.status(500).json({ error: 'Server error initializing default habits' });
  }
};

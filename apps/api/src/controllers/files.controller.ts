import { Response } from 'express';
import {
  deleteFileService,
  getFilesService,
  getProfileService,
  updateProfileService,
} from '../services/files.service.js';
import { AuthRequest } from '../types/express.types.js';

/**
 * GET /api/v1/files
 * Get all user files (documents + images)
 */
export const getFilesController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const files = await getFilesService(userId);
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

/**
 * DELETE /api/v1/files/:type/:id
 * Delete a file (document or image)
 */
export const deleteFileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type, id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!type || !id) {
      res.status(400).json({ error: 'File type and ID are required' });
      return;
    }

    if (type !== 'document' && type !== 'image') {
      res.status(400).json({ error: 'Invalid file type. Must be "document" or "image"' });
      return;
    }

    await deleteFileService(id, type, userId);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to delete file' });
  }
};

/**
 * GET /api/v1/profile
 * Get user profile with account information
 */
export const getProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const profile = await getProfileService(userId);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * PUT /api/v1/profile
 * Update user profile (name, email)
 */
export const updateProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!name && !email) {
      res.status(400).json({ error: 'At least one field (name or email) is required' });
      return;
    }

    const updated = await updateProfileService(userId, { name, email });
    res.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

import { Response } from 'express';
import { changePasswordService, updateEmailService } from '../services/settings.service.js';
import { AuthRequest } from '../types/express.types.js';

/**
 * POST /api/v1/settings/password
 * Change user password
 */
export const changePasswordController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long' });
      return;
    }

    const result = await changePasswordService(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    console.error('Error changing password:', error);
    const err = error as Error;

    // Send appropriate error message
    if (
      err.message.includes('social media') ||
      err.message.includes('social provider') ||
      err.message.includes('No password found')
    ) {
      res.status(403).json({ error: err.message });
    } else if (err.message.includes('incorrect')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
};

/**
 * PUT /api/v1/settings/email
 * Update user email
 */
export const updateEmailController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { email } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const result = await updateEmailService(userId, email);
    res.json(result);
  } catch (error) {
    console.error('Error updating email:', error);
    const err = error as Error;

    if (err.message.includes('already in use')) {
      res.status(409).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to update email' });
    }
  }
};

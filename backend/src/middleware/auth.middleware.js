import { requireAuth } from '@clerk/express';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';
export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkUserId = req.auth().userId;
      if (!clerkUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({ clerkId: req.auth().userId });
  // console.log('Checking admin access for user:', user);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - user not found' });
  }

  if (user.email !== ENV.ADMIN_EMAIL) {
    // console.log('admin', user.email);
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

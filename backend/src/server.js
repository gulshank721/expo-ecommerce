import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './config/db.js';

import { clerkMiddleware } from '@clerk/express';

import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.js';

import adminRoutes from './routes/admin.route.js';
import cartRoutes from './routes/cart.route.js';
import userRoutes from './routes/user.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under the request
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use('/api/inngest', serve({ client: inngest, functions }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);

// make app ready for development
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../admin/dist')));

  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin/dist/index.html'));
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

startServer();

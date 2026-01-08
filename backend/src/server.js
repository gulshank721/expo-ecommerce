import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './config/db.js';

import { clerkMiddleware } from '@clerk/express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(clerkMiddleware()); // adds auth object under the request

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

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

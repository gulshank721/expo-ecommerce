import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './config/db.js';

import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';

import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.js';

import adminRoutes from './routes/admin.route.js';
import cartRoutes from './routes/cart.route.js';
import userRoutes from './routes/user.route.js';
import orderRoutes from './routes/order.route.js';
import reviewRoutes from './routes/review.route.js';
import productRoutes from './routes/product.route.js';
import paymentRoutes from './routes/payment.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// special handling: Stripe webhook needs raw body BEFORE any body parsing middleware
// apply raw body parser conditionally only to webhook endpoint
app.use(
  '/api/payment',
  (req, res, next) => {
    if (req.originalUrl === '/api/payment/webhook') {
      express.raw({ type: 'application/json' })(req, res, next);
    } else {
      express.json()(req, res, next); // parse json for non-webhook routes
    }
  },
  paymentRoutes
);

app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under the request
// Set up the "/api/inngest" (recommended) routes with the serve handler

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ENV.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Inngest
app.use('/api/inngest', serve({ client: inngest, functions }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);

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

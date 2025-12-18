import { auth } from '@repo/auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { handleWebhook } from './controllers/payment.controller.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import documentsRoutes from './routes/document.routes.js';
import filesRoutes from './routes/files.routes.js';
import imageRoutes from './routes/images.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import planRoutes from './routes/plan.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { validateEnvironment } from './utils/env-validation.js';
import { cleanupTempFiles } from './utils/startup-cleanup.js';

dotenv.config();

// Validate environment variables
validateEnvironment();

// Clean up old temporary files from previous runs
cleanupTempFiles();

const app = express();
const port = process.env.API_PORT || 3001;

const server = http.createServer(app);

// Express-level
app.use((req, res, next) => {
  req.setTimeout(10 * 60 * 1000);
  res.setTimeout(10 * 60 * 1000);
  next();
});

// Node server-level
server.timeout = 10 * 60 * 1000;
server.headersTimeout = 10 * 60 * 1000;
server.keepAliveTimeout = 10 * 60 * 1000;

app.use(
  cors({
    origin: [
      process.env.NEXT_PUBLIC_APP_URL!
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-fingerprint'],
  })
);

app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/payments', paymentRoutes);

app.all('/api/auth/*path', toNodeHandler(auth));
app.use('/test', authMiddleware);

app.use('/api/v1', uploadRoutes);
app.use('/api/v1', filesRoutes);
app.use('/api/v1', planRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/documents', authMiddleware, documentsRoutes);
app.use('/api/v1/images', authMiddleware, imageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobsRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

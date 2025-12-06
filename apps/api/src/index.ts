import { auth } from '@repo/auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { authMiddleware } from './middleware/auth.middleware.js';
import documentsRoutes from './routes/document.routes.js';
import imageRoutes from './routes/images.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

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
    origin: ['http://localhost:3000', process.env.NEXT_PUBLIC_APP_URL || ''],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/api/auth/*path', toNodeHandler(auth));
app.use('/test', authMiddleware);

app.use('/api/v1', uploadRoutes);
app.use('/api/v1/documents', authMiddleware, documentsRoutes);
app.use('/api/v1/images', authMiddleware, imageRoutes);
app.use('/api/jobs', jobsRoutes);

// Global Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error Handler Reached:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

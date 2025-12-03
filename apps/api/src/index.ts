import { auth } from '@repo/auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import documentsRoutes from './routes/document.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import imageRoutes from './routes/images.routes.js';

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

app.use('/api/v1', uploadRoutes);
app.use('/api/v1/documents', documentsRoutes);
app.use('/api/v1/images', imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

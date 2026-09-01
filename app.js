import express from 'express';
import apiRouter from './routes/apiRoutes.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

const app = express();

app.use(helmet());

app.use(
  hpp({
    whitelist: ['url'],
  }),
);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Try again later.' },
});

app.use('/api/v1', limiter);

app.use(
  cors({
    origin: '*',
  }),
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', apiRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    status: 'error',
    message: err.message || 'Something went wrong',
  });
});

export default app;

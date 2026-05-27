import 'dotenv/config';
import express, { Application } from 'express';
import mongoose                 from 'mongoose';

import { authRouter }         from './modules/auth/auth.routes';
import { employeeRouter }     from './modules/employee/employee.routes';
import { userRouter }         from './modules/user/user.routes';
import { notificationRouter } from './modules/notification/notification.routes';
import { roleRouter }         from './modules/role/role.module';
import { errorHandler }       from './middleware/error.middleware';

const app: Application = express();

// ─── Global Middleware ─────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ────────────────────────────────────────────────────────────────

app.use('/api/employees',     employeeRouter);
app.use('/api/users',         userRouter);
app.use('/api/notifications', notificationRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// ─── Global Error Handler ──────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  const statusMap: Record<string, number> = {
    'not found': 404,
    'already exists': 409,
    'invalid credentials': 401,
  };

  const status = Object.entries(statusMap).find(([key]) =>
    err.message.toLowerCase().includes(key)
  )?.[1] ?? 500;

  res.status(status).json({ success: false, message: err.message });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────

const bootstrap = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/app';
  const PORT      = Number(process.env.PORT ?? 3000);

  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

bootstrap().catch(console.error);

export { app };

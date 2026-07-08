import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - useful to confirm the server is up before wiring real routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FinTrack API is running' });
});

// Route mounts - uncomment each as you build it
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/budgets', budgetRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/reports', reportRoutes);

// 404 + error handler must be last, in this order
app.use(notFound);
app.use(errorHandler);

export default app;
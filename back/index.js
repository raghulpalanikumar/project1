import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import remindersRoutes from './routes/reminders.js';
import recurringRoutes from './routes/recurring.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Increase payload size limit for JSON bodies
app.use(express.json({ limit: '2mb' }));


app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));

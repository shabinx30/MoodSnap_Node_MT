import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './socket';

import authRoutes from './routes/auth.routes';
import moodRoutes from './routes/moods.routes';
import adminRoutes from './routes/admin.routes';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moodsnap_node')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

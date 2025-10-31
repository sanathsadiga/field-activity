import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import entriesRoutes from './routes/entries.js';


const app = express();


app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: false }));
app.use(express.json());


app.get('/', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/entries', entriesRoutes);


const PORT = process.env.PORT || 5002;
connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
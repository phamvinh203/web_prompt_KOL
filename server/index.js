import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/database.js';
import imagePromptRouter from './routes/imagePrompt.js';
import videoPromptRouter from './routes/videoPrompt.js';
import historyRouter from './routes/history.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/image-prompt', imagePromptRouter);
app.use('/api/video-prompt', videoPromptRouter);
app.use('/api/history', historyRouter);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => { console.error('Failed to connect MongoDB:', err.message); process.exit(1); });

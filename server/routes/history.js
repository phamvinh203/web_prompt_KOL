import express from 'express';
import { ImageHistory, VideoHistory } from '../db/models.js';

const router = express.Router();

router.get('/images', async (req, res) => {
  try {
    const rows = await ImageHistory.find().sort({ created_at: -1 }).limit(50).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/videos', async (req, res) => {
  try {
    const rows = await VideoHistory.find().sort({ created_at: -1 }).limit(20).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/images/:id', async (req, res) => {
  try {
    await ImageHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    await VideoHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync } from 'fs';
import { generateImagePrompts } from '../services/gemini.js';
import { ImageHistory } from '../db/models.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

router.post('/', upload.fields([{ name: 'kol_image', maxCount: 1 }, { name: 'product_image', maxCount: 1 }]), async (req, res) => {
  const kolFile = req.files?.kol_image?.[0];
  const productFile = req.files?.product_image?.[0];

  if (!kolFile || !productFile) {
    return res.status(400).json({ error: 'Both kol_image and product_image are required' });
  }

  try {
    const styleOptions = {
      kol_style: req.body.kol_style || 'auto',
      mood: req.body.mood || 'auto',
      setting: req.body.setting || 'auto',
    };
    const result = await generateImagePrompts(kolFile.path, productFile.path, styleOptions);

    await ImageHistory.create({
      kol_filename: kolFile.originalname,
      product_filename: productFile.originalname,
      kol_style: styleOptions.kol_style,
      mood: styleOptions.mood,
      setting: styleOptions.setting,
      pose_prompt: result.pose_prompt,
      motion_prompt: result.motion_prompt,
      continuation_prompt: result.continuation_prompt,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    try { unlinkSync(kolFile.path); } catch {}
    try { unlinkSync(productFile.path); } catch {}
  }
});

export default router;

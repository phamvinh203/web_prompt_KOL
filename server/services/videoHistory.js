import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const HISTORY_FILE = path.join(DATA_DIR, 'video-history.json');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function readVideoHistory() {
  ensureDir();
  if (!existsSync(HISTORY_FILE)) return [];
  try { return JSON.parse(readFileSync(HISTORY_FILE, 'utf-8')); }
  catch { return []; }
}

export function saveVideoHistory(entry) {
  ensureDir();
  const history = readVideoHistory();
  const record = { _id: uuidv4(), created_at: new Date().toISOString(), ...entry };
  history.unshift(record);
  writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 100), null, 2));
  return record;
}

export function deleteVideoHistory(id) {
  const history = readVideoHistory();
  writeFileSync(HISTORY_FILE, JSON.stringify(history.filter(h => h._id !== id), null, 2));
}

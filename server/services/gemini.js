import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

const IMAGE_SYSTEM_PROMPT = `You are an expert AI video prompt engineer specializing in GROK AI (xAI) video and image generation.
Your task: analyze a KOL (Key Opinion Leader / model) image and a product image, then generate 3 precise prompts optimized for GROK AI.

Return ONLY valid JSON with exactly these 3 fields, no markdown, no explanation:
{
  "pose_prompt": "Detailed description of the KOL wearing or holding the product. Include: physical appearance, outfit details, how the product is worn/held, pose, facial expression, lighting, background setting, photography style, camera angle.",
  "motion_prompt": "First half of a short video. Include: opening shot, camera movement (pan/zoom/dolly), body movement, gestures, pacing (slow/medium/fast), mood, transition into scene.",
  "continuation_prompt": "Second half of the video continuing naturally from motion_prompt. Include: camera movement, body movement, product highlight moment, closing shot, fade or cut style."
}

Rules:
- All prompts in English only
- Cinematic quality language
- Specific and detailed (avoid vague terms)
- Optimized for short-form sales video (15-30 seconds)`;

const VIDEO_SEGMENT_PROMPT = (index, start, end) =>
  `Analyze this video frame extracted from segment ${index} (${start}s - ${end}s of the original video).
Generate a GROK AI motion prompt for this segment in English.

Include:
- Subject movement and body language
- Camera angle and movement type (pan left/right, zoom in/out, dolly, static)
- Lighting quality and atmosphere
- Pacing description (slow-motion, normal, fast-cut)
- Any notable visual elements

Return ONLY the motion prompt text. No explanation, no JSON, no markdown.`;

function fileToInlinePart(filePath, mimeType) {
  const data = readFileSync(filePath);
  return {
    inlineData: {
      data: data.toString('base64'),
      mimeType,
    },
  };
}

function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  return map[ext] || 'image/jpeg';
}

export async function generateImagePrompts(kolImagePath, productImagePath) {
  const kolPart = fileToInlinePart(kolImagePath, getMimeType(kolImagePath));
  const productPart = fileToInlinePart(productImagePath, getMimeType(productImagePath));

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: IMAGE_SYSTEM_PROMPT },
          { text: 'KOL image:' },
          kolPart,
          { text: 'Product image:' },
          productPart,
          { text: 'Generate the 3 prompts as JSON.' },
        ],
      },
    ],
  });

  const text = response.candidates[0].content.parts[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON');
  return JSON.parse(jsonMatch[0]);
}

export async function generateVideoSegmentPrompt(framePath, index, start, end) {
  const framePart = fileToInlinePart(framePath, 'image/jpeg');

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          framePart,
          { text: VIDEO_SEGMENT_PROMPT(index, start, end) },
        ],
      },
    ],
  });

  return response.candidates[0].content.parts[0].text.trim();
}

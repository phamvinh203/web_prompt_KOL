import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

function buildImageSystemPrompt(styleOptions = {}) {
  const { kol_style = 'auto', mood = 'auto', setting = 'auto' } = styleOptions;

  const styleInstructions = [
    kol_style !== 'auto' ? `KOL Style Direction: ${KOL_STYLES[kol_style]?.label || kol_style} — ${KOL_STYLES[kol_style]?.description || ''}` : 'KOL Style: Analyze the KOL image and choose the most fitting style automatically.',
    mood !== 'auto' ? `Visual Mood: ${MOODS[mood]?.label || mood} — ${MOODS[mood]?.description || ''}` : 'Visual Mood: Choose the most fitting mood based on the product and KOL.',
    setting !== 'auto' ? `Setting/Background: ${SETTINGS[setting]?.label || setting} — ${SETTINGS[setting]?.description || ''}` : 'Setting: Choose the most fitting setting automatically.',
  ].join('\n');

  return `You are an expert AI video prompt engineer specializing in GROK AI (xAI) video generation for short-form sales content.

Your task: Analyze the KOL (Key Opinion Leader / model) image and product image provided.
Apply these style directions:
${styleInstructions}

Return ONLY valid JSON — no markdown, no explanation — with exactly this structure:
{
  "pose_prompt": {
    "en": "English pose prompt",
    "vi": "Bản dịch tiếng Việt của pose prompt"
  },
  "motion_prompt": {
    "en": "English motion prompt",
    "vi": "Bản dịch tiếng Việt của motion prompt"
  },
  "continuation_prompt": {
    "en": "English continuation prompt",
    "vi": "Bản dịch tiếng Việt của continuation prompt"
  }
}

Prompt writing rules:
- pose_prompt (EN): KOL wearing/holding the product. Include: physical appearance, outfit, how product is worn/held, body pose, facial expression, lighting, background, camera angle, photographic style.
- motion_prompt (EN): First half of a 15-30s short video. Include: opening shot, camera movement (pan/zoom/dolly/static), body movement, pacing (slow/normal/fast), mood atmosphere, scene transition.
- continuation_prompt (EN): Second half continuing naturally. Include: camera movement, body movement, product close-up highlight, closing shot style.
- Vietnamese (vi): Faithful translation preserving all technical cinematic terms. Keep proper nouns (GROK AI terms) in English within the Vietnamese text.
- All prompts: cinematic quality, specific and detailed, optimized for short-form sales video.`;
}

const VIDEO_SEGMENT_PROMPT = (index, start, end) =>
  `Analyze this video frame extracted from segment ${index} (${start}s – ${end}s).
Generate a GROK AI motion prompt for this segment in English.
Include: subject movement, body language, camera angle and movement type, lighting, pacing.
Return ONLY the motion prompt text. No explanation, no JSON, no markdown.`;

const KOL_STYLES = {
  luxury:    { label: 'Luxury & High Fashion', description: 'Refined, editorial, haute couture energy. Think Vogue cover aesthetics.' },
  street:    { label: 'Street Style', description: 'Urban, edgy, raw authenticity. Candid movement, graphic outfits.' },
  kbeauty:   { label: 'K-Beauty Natural', description: 'Dewy skin, soft pastels, gentle movements. Korean beauty aesthetic.' },
  editorial: { label: 'Editorial Magazine', description: 'Artistic, conceptual, bold composition. Print magazine quality.' },
  sporty:    { label: 'Sporty & Active', description: 'Dynamic movement, athletic energy, functional aesthetic.' },
  vintage:   { label: 'Vintage Retro', description: 'Film grain, warm tones, nostalgic 70s-90s aesthetic.' },
};

const MOODS = {
  cinematic:  { label: 'Cinematic Dramatic', description: 'Deep shadows, anamorphic lens flares, movie-grade grading.' },
  dreamy:     { label: 'Soft & Dreamy', description: 'Soft bokeh, overexposed highlights, ethereal floating quality.' },
  vibrant:    { label: 'Vibrant & Energetic', description: 'High saturation, dynamic cuts, bold color pops.' },
  minimal:    { label: 'Clean Minimal', description: 'White space, stark lighting, quiet confidence.' },
  moody:      { label: 'Dark & Moody', description: 'Low-key lighting, rich darks, mysterious atmosphere.' },
};

const SETTINGS = {
  studio:       { label: 'Studio White', description: 'Seamless white backdrop, controlled soft lighting.' },
  golden_hour:  { label: 'Golden Hour Outdoor', description: 'Warm sunset light, natural environment, glowing backlight.' },
  urban:        { label: 'Urban Street', description: 'City backdrop, architectural elements, lifestyle context.' },
  nature:       { label: 'Nature & Garden', description: 'Greenery, natural light, organic textures.' },
  night_neon:   { label: 'Night Neon', description: 'Neon lights, city night, glowing color reflections.' },
};

export { KOL_STYLES, MOODS, SETTINGS };

function fileToInlinePart(filePath, mimeType) {
  const data = readFileSync(filePath);
  return { inlineData: { data: data.toString('base64'), mimeType } };
}

function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[ext] || 'image/jpeg';
}

export async function generateImagePrompts(kolImagePath, productImagePath, styleOptions = {}) {
  const kolPart = fileToInlinePart(kolImagePath, getMimeType(kolImagePath));
  const productPart = fileToInlinePart(productImagePath, getMimeType(productImagePath));
  const systemPrompt = buildImageSystemPrompt(styleOptions);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{
      role: 'user',
      parts: [
        { text: systemPrompt },
        { text: 'KOL / Model image:' }, kolPart,
        { text: 'Product image:' }, productPart,
        { text: 'Generate the 3 bilingual prompts as JSON.' },
      ],
    }],
  });

  const text = response.candidates[0].content.parts[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

  const parsed = JSON.parse(jsonMatch[0]);

  // Normalize: support both flat string and {en, vi} object
  function normalize(field) {
    if (typeof field === 'string') return { en: field, vi: field };
    return field;
  }

  return {
    pose_prompt: normalize(parsed.pose_prompt),
    motion_prompt: normalize(parsed.motion_prompt),
    continuation_prompt: normalize(parsed.continuation_prompt),
  };
}

export async function generateVideoSegmentPrompt(framePath, index, start, end) {
  const framePart = fileToInlinePart(framePath, 'image/jpeg');
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [framePart, { text: VIDEO_SEGMENT_PROMPT(index, start, end) }] }],
  });
  return response.candidates[0].content.parts[0].text.trim();
}

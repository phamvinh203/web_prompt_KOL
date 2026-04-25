import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { logInfo, logOk, logErr, elapsed } from '../utils/logger.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemma-3-27b-it';

function buildImageSystemPrompt(styleOptions = {}) {
  const { kol_style = 'auto', mood = 'auto', setting = 'auto', scenario = 'auto' } = styleOptions;

  const styleInstructions = [
    kol_style !== 'auto' ? `KOL Style Direction: ${KOL_STYLES[kol_style]?.label || kol_style} — ${KOL_STYLES[kol_style]?.description || ''}` : 'KOL Style: Analyze the KOL image and choose the most fitting style automatically.',
    mood !== 'auto' ? `Visual Mood: ${MOODS[mood]?.label || mood} — ${MOODS[mood]?.description || ''}` : 'Visual Mood: Choose the most fitting mood based on the product and KOL.',
    setting !== 'auto' ? `Setting/Background: ${SETTINGS[setting]?.label || setting} — ${SETTINGS[setting]?.description || ''}` : 'Setting: Choose the most fitting setting automatically.',
    scenario !== 'auto' ? `VIDEO SCENARIO (MOST IMPORTANT): ${SCENARIOS[scenario]?.label || scenario} — ${SCENARIOS[scenario]?.description || ''}` : 'Video Scenario: Choose naturally based on product type.',
  ].join('\n');

  const scenarioRules = scenario !== 'auto' ? `
SCENARIO-SPECIFIC RULES for "${SCENARIOS[scenario]?.label}":
${SCENARIOS[scenario]?.promptGuide || ''}
` : '';

  return `You are an expert AI video prompt engineer specializing in GROK AI (xAI) video generation for short-form sales content (TikTok / Instagram Reels / YouTube Shorts style).

Your task: Analyze the KOL (Key Opinion Leader / model) image and product image provided.
Apply these style directions:
${styleInstructions}
${scenarioRules}
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
- motion_prompt (EN): First half of a 15-30s short video. Follow the chosen scenario strictly. Include: opening shot, camera movement, body movement, pacing, mood atmosphere.
- continuation_prompt (EN): Second half continuing naturally from motion_prompt. Include: camera movement, body movement, product close-up highlight, closing shot.
- Vietnamese (vi): Faithful translation preserving all technical cinematic terms. Keep proper nouns in English.
- All prompts: cinematic quality, specific and detailed, optimized for short-form sales video.`;
}

const VIDEO_SEGMENT_PROMPT = (index, start, end) =>
  `Analyze this video frame extracted from segment ${index} (${start}s – ${end}s).
Generate a GROK AI motion prompt for this segment.
Include: subject movement, body language, camera angle and movement type, lighting, pacing.
Return ONLY valid JSON with exactly this structure — no markdown, no explanation:
{
  "en": "Motion prompt in English",
  "vi": "Motion prompt in Vietnamese (keep cinematic/technical terms in English: slow-motion, close-up, bokeh, handheld, etc.)"
}`;

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

const SCENARIOS = {
  mirror_selfie: {
    label: 'Khoe đồ trước gương',
    description: 'Girl holds smartphone filming herself, shows off outfit in mirror. Authentic lifestyle self-recording style.',
    promptGuide: `
- pose_prompt: KOL standing in front of full-length mirror, holding smartphone up to film reflection. Product (outfit/item) clearly visible on body. Natural indoor lighting, mirror reflection creates double visual. Casual, authentic, lifestyle feel.
- motion_prompt: Opens with KOL walking toward mirror while holding phone up. She turns slowly left and right showing off the outfit from all angles. Camera (her phone) captures her reflection. Pacing: relaxed and natural, like a real try-on video. She touches/adjusts the product with her free hand.
- continuation_prompt: KOL turns to face camera directly (breaking mirror shot), smiles and points to the product. Quick zoom-in to product detail in mirror reflection. Ends with satisfied smile, maybe a little spin. Natural, authentic TikTok-style closing.`,
  },
  unboxing_reveal: {
    label: 'Khui đồ & mặc thử',
    description: 'Girl unboxes product, briefly covers camera with packaging/cloth for surprise transition, then reveals herself wearing it.',
    promptGuide: `
- pose_prompt: KOL sitting or standing, holding the unopened product package with excitement. Product box/bag clearly visible. Anticipation expression, leaning forward slightly. Bright, clean lighting showing product packaging details.
- motion_prompt: Opens with KOL excitedly opening the product box/bag, pulling out the item with delight. She holds the product up to camera for a close-up reveal. Then she playfully lifts the packaging/bag to completely cover the camera lens — screen goes dark for 1-2 seconds (blackout transition). Pacing: energetic and fun, TikTok unboxing energy.
- continuation_prompt: Camera uncovers to reveal KOL already wearing/using the product, fully styled and confident. She does a slow spin or poses to show the full look. Then direct eye contact with camera, big smile, points to the product on herself. High energy, satisfying reveal moment.`,
  },

  before_after: {
    label: 'Transition Before/After',
    description: 'KOL shows herself before (casual/plain look) then transitions smoothly into wearing the product — satisfying transformation reveal.',
    promptGuide: `
- pose_prompt: Split-concept frame. Left side: KOL in casual plain outfit, relaxed and natural. Right side (or implied): KOL fully styled with the product, confident and polished. Clean center composition for transition effect. Neutral background to maximize contrast between before/after.
- motion_prompt: Opens on KOL in casual look — no makeup or simple outfit, candid and relaxed. She faces the camera, then does a swipe gesture or quick spin. Camera whip-pan or jump-cut transition effect. Pacing: slow opening (2s) → fast swipe/spin transition (0.5s). The transition is the hero moment — make it feel satisfying and crisp.
- continuation_prompt: Cut reveals KOL fully transformed wearing the product — same position, totally different energy. She poses confidently, shows product from multiple angles with slow camera orbit. Ends with direct eye contact and a confident smile. Side-by-side comparison moment optional. Closing: product name text overlay space.`,
  },

  street_cafe: {
    label: 'Đi đường / Cafe Lookbook',
    description: 'Outdoor lifestyle lookbook — KOL walks on the street or sits at a cafe wearing the product. Natural, candid, real-life aesthetic.',
    promptGuide: `
- pose_prompt: KOL outdoors — standing on a tree-lined sidewalk, sitting at a cafe window, or walking through a market. Product worn naturally as everyday outfit. Candid, relaxed expression — not posed, feels like a stolen lifestyle shot. Background shows real environment: pedestrians, cafe interior, street signage.
- motion_prompt: Opens with KOL walking toward the camera down a street or through a cafe entrance, product visible in motion. Camera follows at medium distance — slight handheld wobble for authenticity. She glances at something off-frame, laughs naturally, adjusts her bag or hair. Pacing: slow and natural, like a fashion documentary behind-the-scenes.
- continuation_prompt: Camera settles as KOL sits at a cafe table or leans against a wall. She looks down at her coffee/phone briefly then back up — natural lifestyle moment. Slow pan around her showing the full product look from different angles. Ends with her looking directly at camera with a natural smile, product clearly featured.`,
  },

  body_review: {
    label: 'Review dáng người thật',
    description: 'KOL gives an honest, authentic review of how the product fits on a real body — discussing size, form, comfort, and look from all angles.',
    promptGuide: `
- pose_prompt: KOL standing in good lighting, wearing the product on her natural body. Confident, relaxed posture — not overly posed. Full-body or 3/4 shot so product fit is fully visible. Honest, warm expression — feels like talking to a friend. Clean or simple background so the product fit is the main focus.
- motion_prompt: Opens with KOL showing the product from the front, speaking directly to camera (as if doing a review). She turns to the side to show the silhouette and fit. Then turns to the back. She pinches/pulls the fabric to show texture and stretch. Points to specific details: waistband, hem length, sleeve fit. Pacing: relaxed, conversational — like a TikTok try-on haul.
- continuation_prompt: KOL demonstrates movement comfort — sits down, bends, stretches slightly to show how the product moves with the body. Stands back up and does a slow 360° spin for full view. Ends facing camera, points to her favorite feature of the product and gives a thumbs up or nods approvingly. Authentic, trustworthy, relatable closing.`,
  },
};

export { KOL_STYLES, MOODS, SETTINGS, SCENARIOS };

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
  const SCOPE = 'GEMINI';
  logInfo(SCOPE, `Segment ${index} (${start}s–${end}s) → sending frame to ${MODEL}...`);
  const t0 = Date.now();

  try {
    const framePart = fileToInlinePart(framePath, 'image/jpeg');
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [framePart, { text: VIDEO_SEGMENT_PROMPT(index, start, end) }] }],
    });

    const candidate = response.candidates?.[0];

    if (!candidate) {
      const reason = response.promptFeedback?.blockReason ?? 'unknown';
      logErr(SCOPE, `Segment ${index} — no candidates returned. blockReason: ${reason}`);
      throw new Error(`Gemini returned no candidates (blockReason: ${reason})`);
    }

    if (!candidate.content) {
      const reason = candidate.finishReason ?? 'unknown';
      logErr(SCOPE, `Segment ${index} — candidate has no content. finishReason: ${reason}`);
      throw new Error(`Gemini candidate has no content (finishReason: ${reason})`);
    }

    const raw = candidate.content.parts[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini did not return valid JSON for video segment');

    const parsed = JSON.parse(jsonMatch[0]);
    const result = { en: parsed.en?.trim() ?? '', vi: parsed.vi?.trim() ?? '' };

    const preview = (result.vi || result.en).slice(0, 80) + ((result.vi || result.en).length > 80 ? '…' : '');
    logOk(SCOPE, `Segment ${index} done (${elapsed(t0)}) — "${preview}"`);
    return result;
  } catch (err) {
    logErr(SCOPE, `Segment ${index} failed (${elapsed(t0)}) — ${err.message}`);
    throw err;
  }
}

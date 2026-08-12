import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';
import { normalizeLanguage, type Language } from '@/lib/roast-types';

// ============ RATE LIMIT: 3 free roasts per IP per day ============
const FREE_DAILY_LIMIT = 3;

// Map language code → human-readable name for the AI prompt
const LANG_NAME: Record<Language, string> = {
  en: 'English',
  tr: 'Turkish',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  nl: 'Dutch',
  zh: 'Simplified Chinese',
};

async function getIpHash(req: NextRequest): Promise<string> {
  const forwarded = req.headers.get('x-forwarded-for') || 'unknown';
  const ip = forwarded.split(',')[0].trim();
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

async function checkRateLimit(ipHash: string): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db.usageStat.findUnique({ where: { ipHash } });

  if (!existing || existing.lastUsed < today) {
    return { allowed: true, remaining: FREE_DAILY_LIMIT };
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - existing.count);
  return { allowed: remaining > 0, remaining };
}

async function incrementUsage(ipHash: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db.usageStat.findUnique({ where: { ipHash } });
  if (!existing || existing.lastUsed < today) {
    await db.usageStat.upsert({
      where: { ipHash },
      create: { ipHash, count: 1, lastUsed: new Date() },
      update: { count: 1, lastUsed: new Date() },
    });
  } else {
    await db.usageStat.update({
      where: { ipHash },
      data: { count: { increment: 1 }, lastUsed: new Date() },
    });
  }
}

// ============ AI PROMPT BUILDERS ============
type RoastMode = 'roast' | 'professional' | 'jobmatch';

interface RoastResult {
  title: string;
  score: number;
  emoji: string;
  summary: string;
  burns: string[];
  feedback: string[];
  suggestions: string[];
}

function buildSystemPrompt(mode: RoastMode, language: Language, targetJob?: string): string {
  const lang = LANG_NAME[language] || 'English';

  if (mode === 'roast') {
    return `You are a brutally honest, sarcastic career coach who ROASTS resumes with humor but also gives genuinely useful advice. Think of a stand-up comedian who happens to be a hiring manager.

Your job: Read the resume, then respond in ${lang} ONLY.

Return STRICT JSON in this exact shape:
{
  "title": "A short punchy headline (max 80 chars, like a roast)",
  "score": <integer 0-100, overall resume strength>,
  "emoji": "single emoji matching the vibe",
  "summary": "2-3 sentence summary of the resume's overall impression (sarcastic but not cruel)",
  "burns": [<array of 4-6 short, sharp, funny roast lines>],
  "feedback": [<array of 3-5 genuinely useful professional observations>],
  "suggestions": [<array of 4-6 concrete actionable improvements>]
}

Rules:
- Burns must be funny but never personal attacks on identity (no racism, sexism, etc.)
- Feedback must be REAL professional advice
- Suggestions must be specific (not "improve your skills" but "quantify your impact with metrics like 'increased X by Y%'")
- All text in ${lang}
- Return ONLY the JSON, no markdown, no explanation`;
  }

  if (mode === 'professional') {
    return `You are a senior recruiter at a FAANG company giving thoughtful, professional resume feedback. Respond in ${lang} ONLY.

Return STRICT JSON:
{
  "title": "A short professional headline about this resume",
  "score": <0-100>,
  "emoji": "single professional emoji",
  "summary": "2-3 sentence professional assessment",
  "burns": [<array of 3-4 diplomatic observations that could be stronger>],
  "feedback": [<array of 4-6 professional observations>],
  "suggestions": [<array of 5-7 specific actionable improvements>]
}

Same rules: ${lang} only, JSON only, no markdown.`;
  }

  // jobmatch
  return `You are a hiring manager evaluating how well this resume matches the role: "${targetJob || 'Software Engineer'}". Respond in ${lang} ONLY.

Return STRICT JSON:
{
  "title": "Headline about fit for the role",
  "score": <0-100 match score>,
  "emoji": "emoji matching fit level",
  "summary": "2-3 sentence assessment of fit",
  "burns": [<array of 3-5 gaps between resume and target role>],
  "feedback": [<array of 4-6 strengths and weaknesses for this specific role>],
  "suggestions": [<array of 5-7 concrete steps to better position for this role>]
}

Same rules: ${lang} only, JSON only, no markdown.`;
}

function generateSlug(): string {
  const adjectives = ['savage', 'spicy', 'crispy', 'bold', 'wild', 'sharp', 'fierce', 'rare', 'epic', 'mad'];
  const nouns = ['roast', 'burn', 'flame', 'ghost', 'tiger', 'phoenix', 'dragon', 'wolf', 'falcon', 'shadow'];
  const num = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${num}`;
}

function nicknameRandom(): string {
  const adjs = ['Anonymous', 'Mysterious', 'Brave', 'Curious', 'Silent', 'Bold'];
  const nouns = ['Engineer', 'Designer', 'Dev', 'PM', 'Seeker', 'Coder'];
  return `${adjs[Math.floor(Math.random() * adjs.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// ============ MAIN HANDLER ============
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, mode = 'roast', language: rawLang = 'en', targetJob, makePublic = false } = body as {
      resumeText: string;
      mode?: RoastMode;
      language?: string;
      targetJob?: string;
      makePublic?: boolean;
    };
    const language = normalizeLanguage(rawLang);

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text too short. Paste at least 50 characters.' },
        { status: 400 }
      );
    }

    if (resumeText.length > 12000) {
      return NextResponse.json(
        { error: 'Resume too long. Keep it under 12000 characters.' },
        { status: 400 }
      );
    }

    const ipHash = await getIpHash(req);
    const rateLimit = await checkRateLimit(ipHash);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Daily free limit reached. Come back tomorrow or upgrade to Pro.',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // ============ CALL AI ============
    const zai = await ZAI.create();
    const systemPrompt = buildSystemPrompt(mode, language, targetJob);
    const langName = LANG_NAME[language] || 'English';
    const userPrompt = `Please review this resume and return the JSON response in ${langName}:\n\n${resumeText}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // Parse JSON from response (handle markdown-wrapped responses)
    let jsonStr = rawContent.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    // Strip any leading non-JSON
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }

    let result: RoastResult;
    try {
      result = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback: build a basic result from raw content
      result = {
        title: 'Roast received',
        score: 50,
        emoji: '🔥',
        summary: rawContent.slice(0, 300),
        burns: ['AI response could not be parsed cleanly.'],
        feedback: ['Try again for a better result.'],
        suggestions: ['Regenerate the roast.'],
      };
    }

    // ============ SAVE TO DB ============
    const slug = generateSlug();
    const nickname = makePublic ? nicknameRandom() : null;
    const truncated = resumeText.length > 8000 ? resumeText.slice(0, 8000) + '...' : resumeText;

    const roast = await db.roast.create({
      data: {
        resumeText: truncated,
        mode,
        targetJob: targetJob || null,
        result: JSON.stringify(result),
        isPublic: !!makePublic,
        nickname,
        slug,
        language,
        score: typeof result.score === 'number' ? result.score : 0,
        ipHash,
      },
    });

    await incrementUsage(ipHash);

    return NextResponse.json({
      id: roast.id,
      slug: roast.slug,
      isPublic: roast.isPublic,
      nickname: roast.nickname,
      createdAt: roast.createdAt,
      result,
      remaining: rateLimit.remaining - 1,
    });
  } catch (error: unknown) {
    console.error('[ROAST_API_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate roast', detail: message }, { status: 500 });
  }
}

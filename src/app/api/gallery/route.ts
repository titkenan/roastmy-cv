import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public gallery: latest public roasts
export async function GET() {
  try {
    const roasts = await db.roast.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        slug: true,
        nickname: true,
        mode: true,
        score: true,
        language: true,
        result: true,
        createdAt: true,
      },
    });

    const formatted = roasts.map((r) => {
      let parsed: { title?: string; emoji?: string; summary?: string } = {};
      try {
        parsed = JSON.parse(r.result);
      } catch {}
      return {
        id: r.id,
        slug: r.slug,
        nickname: r.nickname,
        mode: r.mode,
        score: r.score,
        language: r.language,
        title: parsed.title || 'Untitled roast',
        emoji: parsed.emoji || '🔥',
        summary: parsed.summary || '',
        createdAt: r.createdAt,
      };
    });

    return NextResponse.json({ roasts: formatted });
  } catch (error) {
    console.error('[GALLERY_ERROR]', error);
    return NextResponse.json({ roasts: [] });
  }
}

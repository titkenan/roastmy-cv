import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get a single roast by slug (for sharing)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const roast = await db.roast.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        nickname: true,
        mode: true,
        score: true,
        language: true,
        result: true,
        isPublic: true,
        createdAt: true,
      },
    });

    if (!roast) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(roast.result);
    } catch {}

    return NextResponse.json({
      ...roast,
      result: parsed,
    });
  } catch (error) {
    console.error('[GET_ROAST_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

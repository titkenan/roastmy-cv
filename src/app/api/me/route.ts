import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/me — return current user + plan
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ user: null, plan: 'free' });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      plan: (session.user as { plan?: string }).plan || 'free',
    });
  } catch (error: unknown) {
    console.error('[ME_API_ERROR]', error);
    return NextResponse.json({ user: null, plan: 'free' });
  }
}

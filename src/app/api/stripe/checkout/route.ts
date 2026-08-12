import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getStripeServer, PRO_PRICE_ID } from '@/lib/stripe';
import { db } from '@/lib/db';

// POST /api/stripe/checkout — create a Stripe Checkout session for Pro upgrade
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to upgrade to Pro.' },
        { status: 401 }
      );
    }

    if (!PRO_PRICE_ID) {
      return NextResponse.json(
        { error: 'Stripe Pro price is not configured. Set STRIPE_PRO_PRICE_ID env var.' },
        { status: 500 }
      );
    }

    const stripe = getStripeServer();
    const email = session.user.email;
    const userId = session.user.id!;

    // Find or create Stripe customer
    let user = await db.user.findUnique({ where: { id: userId } });
    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const origin = req.headers.get('origin') || 'https://roastmy-cv.vercel.app';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/?upgraded=1`,
      cancel_url: `${origin}/?canceled=1`,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
      client_reference_id: userId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', detail: message },
      { status: 500 }
    );
  }
}

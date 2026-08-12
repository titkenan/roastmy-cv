import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { db } from '@/lib/db';

// POST /api/stripe/webhook — handle Stripe events
// Configure webhook in Stripe dashboard → point to: https://roastmy-cv.vercel.app/api/stripe/webhook
// Events to forward: checkout.session.completed, customer.subscription.updated,
//                    customer.subscription.deleted
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[STRIPE_WEBHOOK] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event;
  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[STRIPE_WEBHOOK_VERIFY_FAILED]', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          id: string;
          customer?: string;
          client_reference_id?: string;
          metadata?: { userId?: string };
        };

        // Extract user id from metadata or client_reference_id
        const userId = session.metadata?.userId || session.client_reference_id;
        const customerId = session.customer;

        if (userId && customerId) {
          await db.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
            },
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as {
          id: string;
          customer: string;
          status: string;
          current_period_end: number;
          items?: { data: { price: { id: string } }[] };
          metadata?: { userId?: string };
        };

        // Resolve userId from metadata, fallback to looking up by customerId
        let userId = sub.metadata?.userId;
        if (!userId) {
          const user = await db.user.findFirst({
            where: { stripeCustomerId: sub.customer },
          });
          userId = user?.id;
        }

        if (userId) {
          const priceId = sub.items?.data?.[0]?.price?.id;
          // Active subscription = pro plan; otherwise free
          const isActive = ['active', 'trialing'].includes(sub.status);
          await db.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: sub.id,
              stripePriceId: priceId || null,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              plan: isActive ? 'pro' : 'free',
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as {
          id: string;
          customer: string;
          metadata?: { userId?: string };
        };

        let userId = sub.metadata?.userId;
        if (!userId) {
          const user = await db.user.findFirst({
            where: { stripeCustomerId: sub.customer },
          });
          userId = user?.id;
        }

        if (userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              plan: 'free',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });
        }
        break;
      }

      default:
        // Unhandled event — log for debugging
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('[STRIPE_WEBHOOK_HANDLER_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

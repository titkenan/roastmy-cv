import Stripe from 'stripe';

// Server-side Stripe client (singleton)
let stripeClient: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-08-27.basil' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeClient;
}

// Pro plan price ID — set this in Stripe dashboard first, then env var
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || '';

// Plan helpers
export type Plan = 'free' | 'pro';

export function isProUser(plan?: string | null): boolean {
  return plan === 'pro';
}

// Free tier: 3 roasts/day per IP
export const FREE_DAILY_LIMIT = 3;
// Pro tier: effectively unlimited (we cap at 100 to avoid abuse)
export const PRO_DAILY_LIMIT = 100;

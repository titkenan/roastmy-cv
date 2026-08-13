# 💳 Stripe Setup Guide

This guide walks you through configuring your Stripe account for the RoastMy.cv Pro tier ($5/month subscription).

**Time required**: ~10 minutes

---

## 1. Create a Stripe account (or sign in)

Go to <https://dashboard.stripe.com> and sign in. If you're new, complete the basic account setup (email + 2FA). You can stay in **test mode** for development — no real credit card needed.

---

## 2. Get your API keys

In the Stripe Dashboard:

1. Go to **Developers → API keys**
2. Copy the **Secret key** (starts with `sk_test_...`)
3. (Optional) Copy the **Publishable key** (starts with `pk_test_...`)

Add them to your environment:

```bash
# .env (local)  or  Vercel → Project Settings → Environment Variables
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 3. Create the Pro product & price

1. Go to **Products → Add product**
2. Fill in:
   - **Name**: `RoastMy.cv Pro`
   - **Description**: `Unlimited AI resume roasts, PDF upload, cover letters, priority AI model`
   - **Pricing**: `Recurring` → `$5.00 USD per month`
3. Click **Save product**
4. On the product detail page, scroll to **Pricing** and copy the **Price ID** (starts with `price_...`)

Add to environment:

```bash
STRIPE_PRO_PRICE_ID="price_..."
```

---

## 4. Configure the Customer Portal

The Customer Portal lets Pro subscribers cancel or update their subscription without contacting support.

1. Go to **Settings → Billing → Customer portal**
2. Toggle **Enable the customer portal** = ON
3. Under **Configuration**, set:
   - **Customers can cancel subscriptions**: ✓ Yes
   - **Customers can update payment methods**: ✓ Yes
   - **Customers can update email addresses**: ✗ No (optional)
   - **Customer information**: Show plan details
4. Under **Business details**, add your:
   - Business name (e.g. `RoastMy.cv`)
   - Business logo (optional, square PNG ≥ 128×128)
5. Click **Save**

> No environment variable needed for the portal — it works automatically via `/api/stripe/portal`.

---

## 5. Create the webhook endpoint

The webhook is how Stripe tells RoastMy.cv when a subscription is created, updated, or canceled.

### For local development (Stripe CLI)

```bash
# Install the Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login

# Forward Stripe events to your local Next.js dev server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will print:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxx (^C to quit)
```

Copy that `whsec_...` value into:

```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### For production (Stripe Dashboard)

1. Go to **Developers → Webhooks → Add endpoint**
2. Set **Endpoint URL**:
   ```
   https://your-domain.vercel.app/api/stripe/webhook
   ```
   (For the live app: `https://roastmy-cv.vercel.app/api/stripe/webhook`)
3. Under **Events to send**, select:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add endpoint**
5. On the endpoint detail page, click **Signing secret → Reveal** and copy the `whsec_...` value
6. Add it to your Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
7. Redeploy the project so the new env var takes effect (Vercel → Deployments → Redeploy)

---

## 6. Test the full flow

Use Stripe's test card numbers (no real charge):

| Card number | Behavior |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment (Visa) |
| `4000 0027 6000 3184` | 3D Secure authentication required |
| `4000 0000 0000 9995` | Declined (insufficient funds) |

Any future expiry date and any CVC will work.

**End-to-end test:**

1. Visit your app → click **Sign in** (Google OAuth)
2. After sign-in, click **Upgrade to Pro**
3. Use card `4242 4242 4242 4242` with any future expiry + any CVC
4. Complete checkout → you should be redirected back to `/?upgraded=1`
5. The page reloads → your **Pro** badge should appear next to your avatar
6. Try the **Manage subscription** button → Stripe Customer Portal opens
7. From the portal, cancel the subscription → webhook fires → `plan` flips back to `free`

---

## 7. Going live (production)

When you're ready to accept real payments:

1. In Stripe Dashboard, toggle **Viewing test data** → OFF (top right corner)
2. Repeat steps 2, 3, and 5 above using **live mode** keys and a **live** product/price
3. Update environment variables in Vercel:
   - `STRIPE_SECRET_KEY` → `sk_live_...`
   - `STRIPE_PRO_PRICE_ID` → `price_...` (live product)
   - `STRIPE_WEBHOOK_SECRET` → `whsec_...` (live webhook)
4. Redeploy

> **Important**: Stripe requires you to fully activate your account (business details, bank account, etc.) before going live. Do this in **Settings → Account details**.

---

## Troubleshooting

### `Webhook Error: No signatures found matching the expected signature for payload`

The `STRIPE_WEBHOOK_SECRET` doesn't match the endpoint's signing secret. Double-check you copied the right `whsec_...` value.

### User upgraded but `plan` is still `free`

- Check **Developers → Webhooks** in Stripe Dashboard — look for failed deliveries
- Verify the webhook endpoint URL matches your Vercel domain
- Check Vercel function logs for `/api/stripe/webhook` errors
- The JWT session caches the `plan` claim — the user may need to sign out and sign back in for the change to take effect (this is a known limitation of JWT sessions vs database sessions)

### `STRIPE_PRO_PRICE_ID is not configured`

The env var is empty or missing. Make sure you created the product in Stripe and copied the `price_...` ID.

### Checkout session creates a new Stripe customer every time

The webhook handler updates `stripeCustomerId` on the User record. If your user already had a `stripeCustomerId`, the checkout endpoint reuses it. If not, the checkout handler creates a new customer. This is expected behavior.

---

## Need help?

- Stripe docs: <https://stripe.com/docs>
- Stripe CLI: <https://stripe.com/docs/stripe-cli>
- Subscription lifecycle: <https://stripe.com/docs/billing/subscriptions/overview>
- Customer Portal: <https://stripe.com/docs/billing/subscriptions/customer-portal>

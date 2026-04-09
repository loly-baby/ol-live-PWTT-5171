# Stamp Reuse MVP

A practical MVP for **document stamping + real-world stamp extraction**, now extended with **one-time checkout + a light Pro subscription**.

## What this version does
- Generate a clean transparent digital stamp from templates
- Upload a photo of a stamped paper document and extract the stamp
- Save generated or extracted stamps to a lightweight session / email library
- Upload an image or PDF, drag the stamp to any position, and export the final file
- Charge one-time for result-based workflows
- Offer a single recurring **Pro** plan for repeat users
- Manage recurring billing through Stripe customer portal

## Core stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Sharp for extraction / image compositing
- pdf-lib for PDF stamping
- react-pdf + pdfjs-dist for PDF preview
- Stripe Checkout + Billing Portal + Webhooks

## Run locally
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:generate
npm run dev
```

## Environment variables
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stamp_reuse?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_PRO_MONTHLY=""
```

If Stripe keys are missing, the app falls back to **mock checkout** so the flows can still be demonstrated locally.

## Main routes
- `/` landing page
- `/workspace` full workflow: generate / extract / stamp / export
- `/pricing` one-time checkout + Pro membership signup
- `/billing` membership lookup + Stripe billing portal handoff
- `/history` email-based retrieval placeholder

## Data model additions in this version
- `Order`: one-time checkout records
- `Membership`: email-based lightweight subscription state
- `StampAsset`: reusable transparent stamp library items

## Important implementation note
The extraction engine is intentionally simple and optimized for common red / blue stamp photos on light paper backgrounds. For tougher photos, add OpenCV-based contour detection, perspective correction, and a brush-based cleanup tool in the next iteration.

## Next recommended upgrades
1. Real account system instead of email-only lookup
2. Better photo extraction with perspective correction and brush cleanup
3. Usage gating so Pro enforces unlimited exports while Free keeps preview only
4. Team library and approval workflows
5. Analytics for one-time vs Pro conversion

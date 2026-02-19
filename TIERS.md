# Express CMS — Tier-Based Pricing

## Tier Structure

| | Free | Starter $29.99/mo | Pro $59.99/mo | Enterprise |
|--|------|-------------------|---------------|------------|
| **Storage** | 100MB | 5GB | 50GB | Custom |
| **Channels** | 3 | 25 | Unlimited | Unlimited |
| **Per-file limit** | 20MB | 100MB | 1GB | Custom |
| **Tileset picker** | Default only | Yes | Yes | Yes |
| **Collaboration** | View-only | Owner + editors | Owner + editors | Owner + editors |
| **Video generation** | No | No | Yes | Yes |
| **API access** | No | No | No | Yes |
| **Custom branding** | No | No | No | Yes |
| **Custom domains** | No | No | No | Yes |
| **SSO** | No | No | No | Yes |
| **Support** | Email | Email | Email (priority) | Email (SLA) |
| **Annual discount** | — | ~20% ($23.99/mo) | ~20% ($47.99/mo) | Custom |

---

## Enforcement Rules

### Soft Warning at 80%
- Banner/notification shown when storage usage reaches 80% of limit
- Upload and channel creation still allowed
- "Upgrade" link displayed

### Hard Block at 110%
- New uploads blocked
- New channel creation blocked
- Existing content remains fully accessible (read-only freeze)
- Persistent upgrade prompt

### Downgrade Behavior
- All existing content is preserved — nothing is deleted
- New uploads and channel creation blocked until usage is under the new limit
- Users can delete content themselves to get under the limit, or re-upgrade
- Over-limit banner shown with upgrade CTA

---

## Feature Gating Details

### Storage
- Measured as total across all channels owned by the user (recursive, includes children)
- Includes: media files, audio files, overlays, asset bundles, channel pictures
- Enforcement checks the **channel owner's** plan, not the uploading user's (editors upload to someone else's channel)

### Channels
- Count of all channels where user is the owner
- Limit applies to creation only — existing channels are never removed on downgrade

### Per-file Limit
- Checked on each upload, both client-side (UX) and server-side (enforcement)
- Applies to all upload paths: authenticated, privateID, and public submission

### Tileset Picker
- Free users get the default tileset only (no dropdown in map view)
- Starter+ users see the tileset selection dropdown
- Server-side enforcement prevents tileset changes via API for Free users

### Collaboration
- Free: view-only access via public links (uniqueID)
- Starter+: can add editors to channels, full owner + editor permission model
- Server-side enforcement prevents adding editors for Free users

### Video Generation
- Boolean gate: Pro and Enterprise only
- Not metered — unlimited use within tier
- Fire-and-forget to external video service, no tracking
- Server-side enforcement via JWT check on makevideo API route

### API Access
- Enterprise only
- Implementation deferred

### SSO
- Enterprise only
- Implementation deferred — listed in pricing table only

---

## Billing

### Payment Provider
- Stripe (Checkout + Customer Portal + Webhooks)

### Pricing (in cents for Stripe)
| Plan | Monthly | Annual (per month) | Annual (total) |
|------|---------|-------------------|----------------|
| Free | 0 | 0 | 0 |
| Starter | 2999 | 2399 | 28788 |
| Pro | 5999 | 4799 | 57588 |
| Enterprise | Custom | Custom | Custom |

### Stripe Integration Points
- `POST /api/createCheckout` — creates Stripe checkout session for new subscriptions
- `POST /api/createPortal` — opens Stripe customer portal for billing management
- `POST /api/stripeWebhook` — handles Stripe events (subscription changes, payments, cancellations)

### Webhook Events Handled
- `checkout.session.completed` → activate plan
- `customer.subscription.updated` → update plan on change
- `customer.subscription.deleted` → downgrade to Free
- `invoice.payment_failed` → log warning

---

## Data Model

### User Schema (Strapi)
New fields added to `users-permissions` user:
- `plan` — enum: free/starter/pro/enterprise (default: "free")
- `stripeCustomerId` — string (private)
- `stripeSubscriptionId` — string (private)
- `billingInterval` — enum: monthly/annual (default: "monthly")
- `planOverrides` — JSON (Enterprise custom limits, e.g. `{"storageMB": 500000}`)

### Tier Config (Strapi)
Single source of truth at `strapi/config/tiers.js` — defines all limits, prices, and feature flags per tier.

### Client Config (Express)
Display-friendly copy at `express/data/tiers.js` — human-readable limits and prices for the pricing table UI.

---

## Deployment Modes

### Cloud (Hosted)
The default. Users sign up on the hosted platform, tiers enforced per-user via Stripe billing.

### Self-Hosted (GitHub)
Anyone can clone the repo and run it. **All features are unlocked with no tier enforcement** when Stripe is not configured. If `STRIPE_SECRET_KEY` is not set, all tier checks are skipped and every user gets full access.

**Implementation:** Enforcement code checks `if (!process.env.STRIPE_SECRET_KEY) → allow` before any tier check. No license keys, no deployment modes, no extra env vars.

### Enterprise (Cloud)
Enterprise is manually managed:
1. Set user's `plan` to "enterprise" via Strapi admin panel
2. Set custom limits via `planOverrides` JSON field (e.g. `{"storageMB": 500000, "maxFileSizeMB": 5000}`)
3. Stripe subscription managed separately or via custom invoicing
4. "Contact Us" flow on marketing page (email link)

### Enterprise (Self-Hosted / On-Prem)
Deferred until first customer requests it. Would use a license key instead of Stripe — the instance runs as Enterprise for all users, no per-user billing. See Key Design Decisions for notes.

---

## Implementation Phases

### Phase 1: Tier Configuration & Data Model
- Create tier config files (Strapi + Express)
- Extend user schema with plan/billing fields
- Add helper functions to Strapi (getUserTierConfig, calculateUserTotalStorage, etc.)

### Phase 2: Server-Side Enforcement
- getUserPlan API endpoint
- Enforce limits on: channel creation, uploads (storage + file size), video generation, editor management, tileset selection

### Phase 3: Stripe Integration
- Install Stripe, configure env vars
- Create checkout, webhook, and portal API routes
- Strapi endpoints for plan management (called by webhooks)

### Phase 4: Frontend — Marketing Page, Pricing & Usage Display
- Marketing landing page replaces logged-out index (hero, features, sample maps, pricing table, links to github for frontend and backend, footer)
- Pricing table component with monthly/annual toggle
- Usage banner on logged-in dashboard (storage bar, channel count)
- Checkout/portal hooks

### Phase 5: Frontend Feature Gating
- Gate tileset picker, video generation button, editor management, channel creation in UI
- Client-side file size validation
- Upgrade prompts at limit boundaries

### Phase 6: Navigation & Polish
- Pricing/upgrade link in navbar
- Over-limit display for downgrades
- Webhook edge cases and idempotency

---

## Key Design Decisions

1. Enforcement checks the **channel owner's** plan, not the uploading user's
2. `calculateChannelSize` returns MB (KB/1024) — tier config uses MB to match
3. Downgrade = read-only freeze, no data deletion
4. Enterprise is manual (Strapi admin + planOverrides JSON)
5. Video generation is boolean (Pro+), not metered
6. Client-side validation is convenience only — server-side is the real gate
7. SSO listed as Enterprise feature, implementation deferred
8. Marketing page replaces logged-out index — no separate /pricing route
9. Sample maps on marketing page reuse existing Mapper component or screenshots + links
10. **Self-hosted = fully unlocked** — no Stripe config means no enforcement, all features available. Standard open-source model.
11. **Enterprise on-prem** deferred — would use license key for support/SLA tracking, but features are already unlocked

# CairnCareers Revised Landing Page — Content and State Specification

## Core Hero

**Default eyebrow:** For college students and recent graduates

**H1 (9 words):** Find an entry-level path that holds up to AI.

**Supporting line:** Compare realistic career paths using salary, job growth, and AI context—then leave with a next move you can explain.

**Primary CTA:** Show me my career paths

**Secondary action:** Take a product tour

**Risk reversal:** Pre-order pricing ends October 31. Full refund if CairnCareers misses the October 21 ship date, or within 30 days of delivery if it is not for you.

## Controlled Acquisition Variants

The H1 remains stable for message consistency. Only the eyebrow and supporting context change.

| Trigger | Eyebrow | Supporting context |
|---|---|---|
| Default | For college students and recent graduates | Compare realistic career paths using salary, job growth, and AI context—then leave with a next move you can explain. |
| `utm_source=campus-partner` or `source=campus` | From campus to a first role that fits | Turn your coursework, experiences, and interests into a career route you can discuss with an adviser, professor, or recruiter. |
| `utm_source=paid-social` or `source=social` | Worried AI changes your first-job options? | See which tasks are exposed, which skills stay durable, and what to do next—without asking a general chatbot to guess. |

## Locale and Currency States

Default locale is U.S. English with a clearly labeled **US$30 USD** checkout price. The explicit selector offers U.S. English now and presents U.K. English and Canadian English as demand-validated pilot variants. Selecting a pilot locale updates spelling and the localized reference price while preserving the final USD charge disclosure.

| Locale | Route state | Local reference | Checkout disclosure |
|---|---|---|---|
| United States · English | `?locale=en-US` | US$30 USD | Final charge: US$30 USD |
| Canada · English | `?locale=en-CA` | Approx. CA$41 CAD | Final charge: US$30 USD; card issuer sets conversion |
| United Kingdom · English | `?locale=en-GB` | Approx. £23 GBP | Final charge: US$30 USD; card issuer sets conversion |

The interface states that additional locales should launch only after demand justifies translation and support costs.

## Email Capture Assessment and Revision

The audit did not find a qualifying email capture; the existing “Questions?” assistant is support rather than lead capture. The revised mockup adds one low-friction asset: **The First-Job AI Readiness Checklist**. It appears as an inline offer and as a dismissible desktop exit-intent or delayed mobile prompt. The form requests email only, states what will be sent, and never blocks the primary purchase path.

## Permissioned Proof Queue

No names, quotes, outcomes, ratings, or photos are fabricated. The mockup reserves:

1. Three student-story cards, each requiring a permissioned real photo, full name, program/school or role context, a specific verified result, and a source/consent date.
2. One permissioned video story focused on a measurable before-and-after result.
3. Three verified product-use metric slots, each requiring a number, date range, cohort definition, and linked source note.
4. One third-party rating slot for a real G2, Capterra, Trustpilot, Product Hunt, App Store, or equivalent profile once it exists.

## Pricing and Urgency

The Premium pre-order remains the highlighted plan. The page states **Pre-order pricing ends October 31** near the hero CTA, pricing card, and closing CTA. This is treated as authentic urgency. The purchase interface shows `US$30 USD` before checkout, even when a localized reference amount is selected.

## Performance Decisions

The page loads only two font families, uses compressed generated images below the fold where possible, lazy-loads all non-hero imagery, reserves image dimensions to avoid layout shift, uses no autoplay video, and contains no blocking marketing pixels. A comment in `client/index.html` marks where nonessential analytics should be deferred until consent or idle time in production.

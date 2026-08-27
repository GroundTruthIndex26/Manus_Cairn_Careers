# CairnCareers Revised Landing Page — Design Direction

## Ground-Truth Reference

The existing [CairnCareers homepage](https://cairncareers.com) is the visual and brand ground truth. This mockup preserves its bold Y2K editorial character, black ink, warm paper, electric-lime signature color, cyan/pink route lines, compact monospaced labels, hard borders, and candid tone. The work is a conversion-focused revision, not a wholesale rebrand.

## Chosen Design Philosophy

**Design movement:** Y2K editorial utility meets career-guidance field notes.

**Core principles:** Preserve the original’s high-contrast personality; make the conversion path visibly singular; separate live claims from future proof placeholders; keep the page candid about the pre-order state; and make every interaction fast, direct, and legible on mobile.

**Color philosophy:** Electric lime remains the ownable action and progress color because it signals forward motion. Black provides decisiveness and contrast. Warm paper makes the experience feel researched rather than tech-generic. Cyan and hot pink appear only as secondary route/map accents so the lime CTA remains dominant.

**Layout paradigm:** The page uses asymmetric editorial splits, wide bordered modules, and staggered evidence blocks rather than a centered card grid. The hero’s left column owns the decision; the right column visualizes the three inputs that support it. Proof placeholders are intentionally separated into a labeled “permissioned proof queue,” avoiding fake content.

**Signature elements:** Numbered route markers; offset hard shadows; thin cyan/pink route lines; compact mono labels; and boxed “trust file” annotations.

**Interaction philosophy:** Interactions should remove hesitation, not add spectacle. The country/currency control is explicit and reversible. UTM/referrer variants change only the eyebrow and supporting message. The pre-order CTA remains the sole solid-lime button; the tour is an outlined text-forward action. Exit-intent is represented by a respectful, user-dismissable career-planning asset prompt.

**Animation:** Use only transform and opacity, generally 140–240 ms with a strong ease-out. Content modules may reveal with short staggered motion. Buttons scale to 0.97 on press. Disable nonessential motion for `prefers-reduced-motion`.

**Typography system:** Use **Archivo Black** for display headlines, **IBM Plex Sans** for body copy, and **IBM Plex Mono** for labels, prices, section numbers, source notes, and controls. Headlines stay dense and blunt; body copy is spacious and practical.

**Brand essence:** A candid, data-supported first-job guide for college students and recent graduates who need a next move—not another generic answer. Personality: **forthright, analytical, encouraging**.

**Brand voice:** Headlines are blunt and outcome-led. CTAs speak in the user’s first person. Microcopy anticipates skepticism and answers it directly.

Example headline: “Find an entry-level path that holds up to AI.”

Example CTA: “Show me my career paths.”

**Wordmark and logo:** Preserve the CairnCareers stacked wordmark concept, paired with a simple three-stone cairn symbol inside a lime-outlined square. Do not replace it with a default-font wordmark.

**Signature brand color:** **Route Lime — #B7FF38**.

## Conversion Revision Contract

The mockup includes an explicit language/country control only as a demand-validated route, USD labeling plus a localized-currency selector, a 10-word outcome-led H1, one dominant first-person CTA, a secondary outline tour link, channel-aware messaging for campus and paid-social traffic, an October 31 pre-order deadline, a low-friction career-planning download/waitlist prompt, clearly labeled spaces for three permissioned student stories, one permissioned video story, a verified-outcomes block that remains empty until sourced metrics exist, and a reserved third-party rating slot.

## Performance Contract

The mockup avoids hero photography, autoplay video, runtime localization APIs, and blocking third-party marketing scripts. Decorative visuals are CSS/SVG-first. Analytics placeholders are documented as deferred. The production target is a fresh-cache mobile load under three seconds; this mockup must build without console errors and must avoid horizontal overflow at 390 px.

## Style Decisions

The proof placeholders must never resemble published testimonials. They are labeled as reserved slots and include explicit requirements such as permissioned name, photo, program, and measurable before/after result. The localized-currency value is presented as an illustrative interface state unless live checkout localization is connected.

Cyan and hot pink remain route-map accents, offset shadows, thin borders, small proof markers, and annotation lines; they never become full-section backgrounds. Route Lime remains the pre-order/progress color, while tour, download, and checklist interactions stay outline- or ink-forward. The header and footer brand stamp shows the cairn symbol inside a lime-outlined square beside the stacked wordmark. Route lines and numbered file markers repeat through the step, proof, pricing, and closing sections so the page reads as one guided map.

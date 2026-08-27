/**
 * CairnCareers revision style note: Y2K editorial utility, asymmetric field-note
 * modules, one solid-lime CTA, candid proof placeholders, and fast mobile behavior.
 */
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  ExternalLink,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Map,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const BASE_URL = import.meta.env.BASE_URL;
const ASSETS = {
  hero: `${BASE_URL}media/cairn-route-map-hero.webp`,
  founder: `${BASE_URL}media/cairn-founder.webp`,
};

const BRAND_ASSETS = {
  icon: `${BASE_URL}brand/cairn-icon.svg`,
  lightLogo: `${BASE_URL}brand/cairn-logo-light.svg`,
  darkLogo: `${BASE_URL}brand/cairn-logo-dark.svg`,
};

const leadCaptureEndpoint = import.meta.env.VITE_LEAD_CAPTURE_ENDPOINT || "/api/launch-notifications";

type LocaleKey = "en-US" | "en-CA" | "en-GB";
type CampaignKey = "default" | "campus" | "social";
type BillingCycle = "monthly" | "annual";

const proPricing: Record<BillingCycle, { price: string; cadence: string; savings?: string }> = {
  monthly: { price: "US$6", cadence: "USD / month" },
  annual: { price: "US$46", cadence: "USD / year", savings: "35% savings" },
};

const premiumPricing: Record<BillingCycle, { regular: string; prelaunch: string; cadence: string }> = {
  monthly: { regular: "US$11", prelaunch: "US$8", cadence: "USD / month" },
  annual: { regular: "US$86", prelaunch: "US$61", cadence: "USD / year" },
};

// Add the two Stripe Payment Link URLs in the preview/deployment environment.
// The CTAs become live checkout links as soon as these values are supplied.
const premiumPaymentLinks: Record<BillingCycle, string> = {
  monthly: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PAYMENT_LINK || "",
  annual: import.meta.env.VITE_STRIPE_PREMIUM_ANNUAL_PAYMENT_LINK || "",
};

const localeOptions: Record<
  LocaleKey,
  { label: string; short: string; price: string; note: string }
> = {
  "en-US": {
    label: "United States · English",
    short: "US · USD",
    price: "US$30 USD",
    note: "Final charge: US$30 USD",
  },
  "en-CA": {
    label: "Canada · English (pilot)",
    short: "CA · CAD",
    price: "Approx. CA$41 CAD",
    note: "Final charge: US$30 USD · card issuer sets conversion",
  },
  "en-GB": {
    label: "United Kingdom · English (pilot)",
    short: "UK · GBP",
    price: "Approx. £23 GBP",
    note: "Final charge: US$30 USD · card issuer sets conversion",
  },
};

const campaignVariants: Record<
  CampaignKey,
  { label: string; eyebrow: string; body: string }
> = {
  default: {
    label: "Default",
    eyebrow: "For college students and recent graduates",
    body: "Compare realistic career paths using salary, job growth, and AI context—then leave with a next move you can explain.",
  },
  campus: {
    label: "Campus partner",
    eyebrow: "From campus to a first role that fits",
    body: "Turn your coursework, experiences, and interests into a career route you can discuss with an adviser, professor, or recruiter.",
  },
  social: {
    label: "Paid social",
    eyebrow: "Worried AI changes your first-job options?",
    body: "See which tasks are exposed, which skills stay durable, and what to do next—without asking a general chatbot to guess.",
  },
};

const steps = [
  ["01", "Bring what you know", "Your interests, coursework, experience, and the work that holds your attention."],
  ["02", "Read the whole picture", "Salary, job growth, and AI exposure in one place—not isolated numbers."],
  ["03", "Leave with a route", "A practical LinkedIn, networking, and first-conversation direction."],
];

const DASHBOARD_PREVIEW_URL = `${BASE_URL}dashboard-preview/index.html`;

const dashboardAreas = [
  {
    number: "01",
    title: "Evidence",
    body: "Turn real work into proof that strengthens a resume bullet, LinkedIn line, and interview answer.",
    href: `${BASE_URL}dashboard-preview/evidence.html`,
    accent: "lime",
  },
  {
    number: "02",
    title: "Portfolio",
    body: "Keep the work itself beside the claim it supports—case studies, reports, prototypes, and decks.",
    href: `${BASE_URL}dashboard-preview/portfolio.html`,
    accent: "cyan",
  },
  {
    number: "03",
    title: "Resume",
    body: "See how one update can carry through a clean, standard resume built from real evidence.",
    href: `${BASE_URL}dashboard-preview/resume.html`,
    accent: "pink",
  },
  {
    number: "04",
    title: "LinkedIn",
    body: "Preview copyable profile blocks without scraping, password requests, or opaque automation.",
    href: `${BASE_URL}dashboard-preview/linkedin.html`,
    accent: "amber",
  },
  {
    number: "05",
    title: "Network",
    body: "Follow warm paths and use the exact message that makes a first outreach easier to send.",
    href: `${BASE_URL}dashboard-preview/network.html`,
    accent: "cyan",
  },
  {
    number: "06",
    title: "Interview",
    body: "Practice clear standard and role-specific answers grounded in evidence you can explain.",
    href: `${BASE_URL}dashboard-preview/interview.html`,
    accent: "lime",
  },
  {
    number: "07",
    title: "Careers",
    body: "Compare pay, growth, work location, and AI context without pretending money changes the score.",
    href: `${BASE_URL}dashboard-preview/careers.html`,
    accent: "amber",
  },
  {
    number: "08",
    title: "Roadmap",
    body: "See a term-by-term route that closes the biggest evidence gaps first.",
    href: `${BASE_URL}dashboard-preview/roadmap.html`,
    accent: "pink",
  },
  {
    number: "09",
    title: "Clean-up",
    body: "Understand the privacy-first path for sensitive context that should never be described to a model.",
    href: `${BASE_URL}dashboard-preview/cleanup.html`,
    accent: "lime",
  },
];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function CairnMark() {
  return (
    <img className="cairn-mark" src={BRAND_ASSETS.icon} alt="" aria-hidden="true" />
  );
}

function ProofPhotoSlot({ index }: { index: number }) {
  return (
    <article className="story-slot">
      <div className="photo-slot" aria-label={`Reserved real student photo slot ${index}`}>
        <UserRound aria-hidden="true" />
        <span>Permissioned real photo</span>
      </div>
      <div className="story-slot-body">
        <div className="slot-badge">Reserved story {index}</div>
        <h3>Student name + program</h3>
        <p>Specific before-and-after result, written only after verification and consent.</p>
        <div className="slot-requirements">
          <span><Check /> Full name</span>
          <span><Check /> Measurable result</span>
          <span><Check /> Consent date</span>
        </div>
      </div>
    </article>
  );
}

function MetricSlot({ label }: { label: string }) {
  return (
    <div className="metric-slot">
      <span className="metric-value">—</span>
      <strong>{label}</strong>
      <small>Publish with cohort, date range, and source</small>
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<LocaleKey>("en-US");
  const [campaign, setCampaign] = useState<CampaignKey>("default");
  const [proBilling, setProBilling] = useState<BillingCycle>("annual");
  const [premiumBilling, setPremiumBilling] = useState<BillingCycle>("annual");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [email, setEmail] = useState("");
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const localized = localeOptions[locale];
  const message = campaignVariants[campaign];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = (params.get("utm_source") || params.get("source") || "").toLowerCase();
    const localeParam = params.get("locale") as LocaleKey | null;
    if (source.includes("campus")) setCampaign("campus");
    if (source.includes("social")) setCampaign("social");
    if (localeParam && localeOptions[localeParam]) setLocale(localeParam);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const params = new URLSearchParams(window.location.search);
    params.set("locale", locale);
    if (campaign === "default") params.delete("source");
    else params.set("source", campaign);
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [campaign, locale]);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, 8000);
    const mobileTimer = window.setTimeout(() => {
      if (window.innerWidth < 768 && !sessionStorage.getItem("cairn-checklist-dismissed")) {
        setShowLeadModal(true);
      }
    }, 45000);
    const onLeave = (event: MouseEvent) => {
      if (
        armed &&
        event.clientY <= 0 &&
        window.innerWidth >= 768 &&
        !sessionStorage.getItem("cairn-checklist-dismissed")
      ) {
        setShowLeadModal(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(armTimer);
      window.clearTimeout(mobileTimer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  const visiblePrice = useMemo(() => localized.price, [localized.price]);
  const proPlan = proPricing[proBilling];
  const premiumPlan = premiumPricing[premiumBilling];
  const premiumPaymentLink = premiumPaymentLinks[premiumBilling];

  const handlePremiumCheckout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (premiumPaymentLink) return;
    event.preventDefault();
    toast.message("Stripe Payment Link required", {
      description: `Add VITE_STRIPE_PREMIUM_${premiumBilling.toUpperCase()}_PAYMENT_LINK to activate this checkout button.`,
    });
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    if (!leadCaptureEndpoint) {
      toast.error("Database capture is not configured for this preview", {
        description: "Add VITE_LEAD_CAPTURE_ENDPOINT before collecting launch-notification signups.",
      });
      return;
    }

    setIsLeadSubmitting(true);
    try {
      const response = await fetch(leadCaptureEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "launch-notification" }),
      });
      if (!response.ok) throw new Error("Lead capture request failed");
      toast.success("You are on the launch-notification list.", {
        description: "We will use this email to let you know when CairnCareers is live.",
      });
      setEmail("");
      setShowLeadModal(false);
      sessionStorage.setItem("cairn-checklist-dismissed", "1");
    } catch {
      toast.error("We could not save your email address", {
        description: "The checklist was not downloaded. Please try again after the database connection is restored.",
      });
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  const dismissLead = () => {
    setShowLeadModal(false);
    sessionStorage.setItem("cairn-checklist-dismissed", "1");
  };

  return (
    <div className="site-shell">
      <div className="deadline-bar">
        <div className="container deadline-inner">
          <span><CalendarDays /> Pre-order price ends October 31</span>
          <span className="deadline-detail">Expected delivery October 21 · 30-day refund window</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="wordmark" aria-label="CairnCareers home">
            <CairnMark />
            <span><strong>Cairn</strong><small>Careers</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#dashboard-preview">Product preview</a>
            <a href="#proof">Proof</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>
          <div className="header-controls">
            <a className="header-cta" href="#premium-checkout">Show me my career paths <ArrowRight /></a>
            <label className="compact-select">
              <Globe2 aria-hidden="true" />
              <span className="sr-only">Country and currency</span>
              <select
                value={locale}
                onChange={(event) => {
                  setLocale(event.target.value as LocaleKey);
                  toast.message(`Locale preview: ${localeOptions[event.target.value as LocaleKey].label}`);
                }}
              >
                {Object.entries(localeOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.short}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <button className="menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav container" aria-label="Mobile navigation">
            <a onClick={() => setMobileOpen(false)} href="#how-it-works">How it works</a>
            <a onClick={() => setMobileOpen(false)} href="#dashboard-preview">Product preview</a>
            <a onClick={() => setMobileOpen(false)} href="#proof">Proof</a>
            <a onClick={() => setMobileOpen(false)} href="#pricing">Pricing</a>
            <a onClick={() => setMobileOpen(false)} href="#about">About</a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow">{message.eyebrow}</div>
              <h1>Find an entry-level path that holds up to AI.</h1>
              <p>{message.body}</p>
              <div className="hero-actions">
                <a className="primary-cta" href="#premium-checkout">Show me my career paths <ArrowRight /></a>
              </div>
              <div className="purchase-context">
                <div><strong>{visiblePrice}</strong><span>{localized.note}</span></div>
                <div><strong>Ends Oct. 31</strong><span>Full refund if the ship date is missed</span></div>
              </div>
            </div>
            <div className="hero-visual" aria-label="Career route from self-knowledge to an evidence-supported next move">
              <img src={ASSETS.hero} alt="Abstract route map with three career-planning waypoints" width="1200" height="675" fetchPriority="high" />
              <div className="hero-route-card">
                <span className="route-card-kicker">A steadier way forward</span>
                <strong>Three signals. One next move.</strong>
                <ol>
                  <li><span>1</span> What you know</li>
                  <li><span>2</span> Market context</li>
                  <li><span>3</span> A route to test</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Trust and risk reversal">
          <div className="container trust-strip-grid">
            <div><ShieldCheck /><span><strong>Full refund</strong> if CairnCareers misses October 21</span></div>
            <div><LockKeyhole /><span><strong>Secure checkout</strong> handled by Stripe</span></div>
            <div><Globe2 /><span><strong>USD labeled</strong> before checkout in every locale</span></div>
          </div>
        </section>

        <section id="how-it-works" className="paper-section route-section">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <SectionLabel number="01">The route</SectionLabel>
                <h2>Career planning that ends with a first move.</h2>
              </div>
              <p>Your map should make the next decision smaller, more specific, and easier to test in the real world.</p>
            </div>
            <div className="steps-grid">
              {steps.map(([number, title, body]) => (
                <article key={number} className="step-card">
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tour" className="ink-section tour-section">
          <div className="container tour-grid">
            <div>
              <SectionLabel number="02">Look before you decide</SectionLabel>
              <h2>See the work, not just the promise.</h2>
              <p>The product tour shows where salary, job growth, AI exposure, resume reframes, and networking routes live before you pre-order.</p>
            </div>
            <div id="tour-preview" className="dashboard-preview" aria-label="Illustrative CairnCareers dashboard preview">
              <div className="preview-top"><span>YOUR FIRST-MOVE MAP</span><span>Coverage 72%</span></div>
              <div className="preview-grid">
                <div className="preview-score"><span>AI exposure</span><strong>42</strong><small>moderate</small></div>
                <div className="preview-chart"><i></i><i></i><i></i><i></i><i></i></div>
                <div className="preview-list"><span>Durable task</span><span>Build stakeholder context</span><span>Next conversation</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard-preview" className="dashboard-bridge-section">
          <div className="container">
            <div className="dashboard-bridge-heading">
              <div>
                <SectionLabel number="03">The sample workspace</SectionLabel>
                <h2>Open the dashboard. Then follow every card.</h2>
              </div>
              <div className="dashboard-bridge-action">
                <p>The public preview is filled with invented data for Maya Rivera. It shows the actual shape of Premium without asking for an account.</p>
              </div>
            </div>

            <div className="module-route-grid" aria-label="Sample dashboard areas">
              {dashboardAreas.map((area) => (
                <a key={area.title} className={`module-route-card ${area.accent}`} href={area.href}>
                  <div className="module-route-top"><span>{area.number}</span><ExternalLink aria-hidden="true" /></div>
                  <h3>{area.title}</h3>
                  <p>{area.body}</p>
                  <span className="module-route-link">Open {area.title} <ArrowRight /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="paper-section proof-section" hidden aria-hidden="true">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <SectionLabel number="04">Permissioned proof queue</SectionLabel>
                <h2>Build proof without pretending it already exists.</h2>
              </div>
              <p>Every slot below stays visibly unpublished until a real student grants permission and the result can be verified.</p>
            </div>

            <div className="outcomes-panel">
              <div className="outcomes-map-bg" aria-hidden="true"><i /><i /><i /></div>
              <div className="outcomes-content">
                <div className="outcomes-heading">
                  <span className="slot-badge">Verified outcomes · reserved</span>
                  <h3>Publish only what can be sourced.</h3>
                </div>
                <div className="metrics-grid">
                  <MetricSlot label="Students mapped" />
                  <MetricSlot label="Next moves completed" />
                  <MetricSlot label="Time to first useful route" />
                </div>
              </div>
            </div>

            <div className="story-grid">
              <ProofPhotoSlot index={1} />
              <ProofPhotoSlot index={2} />
              <ProofPhotoSlot index={3} />
            </div>

            <div className="video-rating-grid">
              <article className="video-slot">
                <div className="video-art">
                  <div className="video-illustration" aria-label="Illustrative empty interview set reserved for a future permissioned student video">
                    <div className="studio-light" />
                    <div className="empty-chair"><i /><i /><i /></div>
                    <div className="microphone"><i /></div>
                    <div className="studio-route"><i /><i /><i /></div>
                  </div>
                  <CirclePlay aria-hidden="true" />
                </div>
                <div>
                  <span className="slot-badge">Permissioned video story · reserved</span>
                  <h3>Before, after, and the verified result between.</h3>
                  <p>Required: a real student, explicit consent, and one measurable change worth showing.</p>
                </div>
              </article>
              <article className="rating-slot">
                <div className="rating-mark">★ — / 5</div>
                <span className="slot-badge">Third-party rating · reserved</span>
                <h3>Connect one verified review profile.</h3>
                <p>Use G2, Capterra, Trustpilot, Product Hunt, App Store, or an equivalent source only after the profile and rating are live.</p>
                <div className="source-placeholder">Verified source URL required <ArrowRight /></div>
              </article>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <SectionLabel number="04">Pricing</SectionLabel>
                <h2>See the price before checkout.</h2>
              </div>
              <div className="locale-disclosure">
                <Globe2 />
                <div><strong>{localized.label}</strong><span>{localized.note}</span></div>
              </div>
            </div>

            <div className="pricing-grid">
              <article className="price-card">
                <span className="price-for">Where do I stand?</span>
                <h3>Free</h3>
                <div className="price"><strong>$0</strong><span>forever</span></div>
                <ul><li><Check /> AI-exposure score</li><li><Check /> Durable-versus-exposed task map</li><li><Check /> Median salary context</li></ul>
              </article>
              <article className="price-card">
                <span className="price-for">How do I get there?</span>
                <h3>Pro</h3>
                <div className="price-toggle" role="group" aria-label="Pro billing frequency">
                  <span>Choose billing</span>
                  <div>
                    <button type="button" aria-pressed={proBilling === "monthly"} className={proBilling === "monthly" ? "active" : ""} onClick={() => setProBilling("monthly")}>Monthly</button>
                    <button type="button" aria-pressed={proBilling === "annual"} className={proBilling === "annual" ? "active" : ""} onClick={() => setProBilling("annual")}>Annual</button>
                  </div>
                </div>
                <div className="price"><strong>{proPlan.price}</strong><span>{proPlan.cadence}</span>{proPlan.savings && <em className="price-saving">{proPlan.savings}</em>}</div>
                <ul><li><Check /> Everything in Free</li><li><Check /> Resume reframes</li><li><Check /> Monthly re-runs</li></ul>
              </article>
              <article id="premium-checkout" className="price-card featured-price">
                <div className="price-ribbon">Limited Time prelaunch price</div>
                <span className="price-for">Know my first move</span>
                <h3>Premium</h3>
                <div className="price-toggle premium-toggle" role="group" aria-label="Premium billing frequency">
                  <span>Choose billing</span>
                  <div>
                    <button type="button" aria-pressed={premiumBilling === "monthly"} className={premiumBilling === "monthly" ? "active" : ""} onClick={() => setPremiumBilling("monthly")}>Monthly</button>
                    <button type="button" aria-pressed={premiumBilling === "annual"} className={premiumBilling === "annual" ? "active" : ""} onClick={() => setPremiumBilling("annual")}>Annual</button>
                  </div>
                </div>
                <div className="price"><s>{premiumPlan.regular} · 35% savings</s><strong>{premiumPlan.prelaunch}</strong><span>{premiumPlan.cadence}</span><em className="prelaunch-label">Limited Time prelaunch price</em><small className="limited-spots">Limited spots remain</small></div>
                <ul><li><Check /> Everything in Pro</li><li><Check /> Living resume + LinkedIn system</li><li><Check /> Warm-path networking engine</li><li><Check /> Graduation-timeline roadmap</li></ul>
                <a className="primary-cta full-cta" href={premiumPaymentLink || "#stripe-payment-link"} onClick={handlePremiumCheckout} target={premiumPaymentLink ? "_blank" : undefined} rel={premiumPaymentLink ? "noreferrer" : undefined}>Continue to secure checkout <ArrowRight /></a>
                <div id="stripe-payment-link" className="checkout-note"><LockKeyhole /> Stripe Payment Link for Premium {premiumBilling} will open here when configured.</div>
              </article>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container about-grid">
            <div>
              <SectionLabel number="05">Why this exists</SectionLabel>
              <h2>A guide should be honest about what it knows.</h2>
              <article className="founder-card">
                <img src={ASSETS.founder} alt="Brooke Houck, PhD, founder of CairnCareers" width="300" height="300" loading="lazy" decoding="async" />
                <div><span className="slot-badge">Built by a PhD research scientist</span><h3><a href="https://www.linkedin.com/in/brookehouck" target="_blank" rel="noreferrer">Brooke Houck, PhD · Founder</a></h3><p>“Everyone has an opinion about AI. And a lot of people want to give you good advice. But work isn't the same anymore. Work has changed and is changing. Cairn Careers uses research standards you can read about openly. We give you data, not vibes, about what work looks like now and will look like 3 years from now.”</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="container closing-inner">
            <span className="hero-eyebrow">The next marker is yours</span>
            <h2>Find my first move before pre-order pricing ends.</h2>
            <a className="primary-cta" href="#premium-checkout">Show me my career paths <ArrowRight /></a>
            <p>Ends October 31 · {localized.note} · 30-day refund window after delivery</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand-block"><div className="wordmark footer-mark"><CairnMark /><span><strong>Cairn</strong><small>Careers</small></span></div><p>Career context for college students and recent graduates.</p><p className="footer-product-line">Cairn Careers is a product of <a href="https://phronesislabs.net" target="_blank" rel="noreferrer">Phronesis Labs, LLC</a>.</p></div>
          <div className="footer-links"><a href="mailto:contact@cairncareers.com">contact@cairncareers.com</a><span><a href="https://privacy.cairncareers.com">Privacy</a> · <a href="https://terms.cairncareers.com">Terms</a> · <a href="https://refunds.cairncareers.com">Refunds</a></span></div>
        </div>
      </footer>

      {showTopButton && (
        <button className="site-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><ArrowUp /></button>
      )}

      {showLeadModal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismissLead(); }}>
          <div className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
            <button className="modal-close" onClick={dismissLead} aria-label="Close checklist offer"><X /></button>
            <span className="slot-badge">Launch notification</span>
            <h2 id="lead-modal-title">Want to know when Cairn Careers is live?</h2>
            <p>Leave your email and we will let you know when the product is ready to use.</p>
            <form className="email-form modal-form" onSubmit={submitLead}>
              <label htmlFor="modal-email">Email address</label>
              <div><Mail /><input id="modal-email" type="email" required placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
              <button type="submit" className="primary-cta" disabled={isLeadSubmitting}>{isLeadSubmitting ? "Saving…" : "Notify me at launch"} <ArrowRight /></button>
              <small>{leadCaptureEndpoint ? "Your email is saved to the launch-notification list." : "Preview mode: connect the database endpoint before collecting emails."}</small>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

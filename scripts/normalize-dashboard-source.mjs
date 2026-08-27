import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dashboardDir = new URL("../dashboard-preview/", import.meta.url);

const canonicalDashboardBrandCss = `<style id="cairn-canonical-brand">
.mark{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.mark img{display:block;width:36px;height:36px;object-fit:contain}
.totop{position:fixed;right:22px;bottom:22px;z-index:70;width:48px;height:48px;padding:0;display:none;font-size:1.05rem;line-height:1}
.totop.show{display:inline-flex}
</style>`;

const backToTopMarkup = `<button class="btn totop" id="totop" aria-label="Back to top">&#9650;</button><script>(function(){var b=document.getElementById("totop");if(!b)return;b.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});function u(){b.classList.toggle("show",window.scrollY>300)}window.addEventListener("scroll",u,{passive:true});u()})();</script>`;

const smoothRoadmapCss = "";

const interviewRepairCss = `/* Interview answer: semantic source with readable landmarks. */
.interview-answer{max-width:820px;margin-inline:auto;padding:28px 32px 34px;background:linear-gradient(135deg,#d9ff67 0%,var(--lime) 60%,#b5e741 100%);box-shadow:9px 9px 0 var(--ink),15px 15px 0 var(--magenta)}
.interview-answer-header{display:grid;grid-template-columns:1fr auto;gap:10px 18px;align-items:start;padding-bottom:16px;border-bottom:2px solid rgba(11,11,11,.64)}
.interview-answer-header .question{grid-column:1/-1;margin:0;font-family:"Archivo Black",Impact,sans-serif;font-size:1.34rem;line-height:1.18;letter-spacing:-.015em;max-width:32ch}
.interview-answer-header .btn{padding:8px 10px;font-size:.6rem;box-shadow:3px 3px 0 var(--ink)}
.answer-landmarks{display:grid;gap:18px;margin-top:22px;max-width:55ch}
.answer-landmark{padding:15px 18px;border-top:2px solid rgba(11,11,11,.66)}
.answer-landmark:first-child{border-top:0;background:var(--ink);color:#fff}
.answer-landmark .eyebrow{display:block;margin-bottom:8px}
.answer-landmark p{margin:0;font-size:.98rem;line-height:1.55;font-weight:600}
.answer-landmark + .answer-landmark p{font-weight:400}
.interview-answer~.g .card.paper2>span{font-family:"Archivo Black",Impact,sans-serif;font-size:1.08rem;line-height:1.18;letter-spacing:-.01em;max-width:27ch}
`;

for (const fileName of readdirSync(dashboardDir)) {
  if (!fileName.endsWith(".html")) continue;

  const filePath = join(dashboardDir.pathname, fileName);
  let html = readFileSync(filePath, "utf8");

  html = html
    .replace(/(<a class="brand" href=")[^"]*(")/g, '$1../#top$2')
    .replaceAll('href="https://cairncareers.com/#preorder-checkout"', 'href="../#pricing"')
    .replaceAll('href="../index.html#top"', 'href="../#top"')
    .replaceAll('href="../index.html#pricing"', 'href="../#pricing"')
    .replaceAll('href="index.html#areas"', 'href="../#dashboard-preview"')
    .replaceAll('href="index.html"', 'href="../#dashboard-preview"');

  html = html
    .replace(/<a([^>]*?)href="[^"]*"([^>]*)>\s*Dashboard\s*<\/a>/gi, '<a$1href="../#dashboard-preview"$2>Dashboard</a>')
    .replace(/<div style="padding:0 0 44px"><a class="btn" href="[^"]*">Back to all nine areas<\/a><\/div>/gi, '')
    .replaceAll('href="https://privacy.cairncareers.com"', 'href="https://cairncareers.com/privacy"')
    .replaceAll('href="https://terms.cairncareers.com"', 'href="https://cairncareers.com/terms"')
    .replaceAll('href="https://refunds.cairncareers.com"', 'href="../refunds.html"')
    .replaceAll('href="https://cairncareers.com/refunds"', 'href="../refunds.html"');

  html = html.replace(/<div[^>]*>\s*<a[^>]*>\s*(?:Back|Return)\s+to\s+(?:all\s+)?(?:the\s+)?(?:nine\s+(?:areas|cards)|dashboard\s+cards)\s*<\/a>\s*<\/div>/gi, '');

  html = html.replace(/<span class="mark"([^>]*)><svg[^>]*>[\s\S]*?<\/svg><\/span>/g, '<span class="mark"$1><img src="../brand/cairn-icon.svg" width="36" height="36" alt="" aria-hidden="true"></span>');

  if (!html.includes('cairn-canonical-brand')) {
    html = html.replace("</head>", `${canonicalDashboardBrandCss}</head>`);
  }

  if (!html.includes('cairn-favicon.svg')) {
    html = html.replace("</head>", '<link rel="icon" href="../brand/cairn-favicon.svg" type="image/svg+xml" sizes="any"></head>');
  }

  if (fileName === "interview.html") {
    const oldInterviewCssStart = html.indexOf("/* Interview page:");
    const oldInterviewCssEnd = html.indexOf("@media (max-width:980px)", oldInterviewCssStart);
    if (oldInterviewCssStart !== -1 && oldInterviewCssEnd !== -1) {
      html = html.slice(0, oldInterviewCssStart) + interviewRepairCss + html.slice(oldInterviewCssEnd);
    }
    html = html.replace(/<div class="sec"><div class="card lime"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><span class="eyebrow">The answer, about 40 seconds<\/span><button class="btn ghost" data-toast="Answer copied">Copy<\/button><\/div><p style="margin:16px 0 0;font-size:1\.12rem;line-height:1\.55;max-width:70ch">[\s\S]*?<\/p><\/div><\/div>(?=<div class="sec"><div><span class="eyebrow">What it is made of)/, `<div class="sec"><div class="card lime interview-answer"><div class="interview-answer-header"><span class="eyebrow">Interview question</span><button class="btn ghost" data-toast="Answer copied">Copy</button><h2 class="question">“Tell me a little about yourself, and why do you want to work here?”</h2></div><div class="answer-landmarks"><div class="answer-landmark"><span class="eyebrow">01 / Position</span><p>I’m an aspiring UX researcher with a Psychology and Design background. I’m drawn to this work because I like finding the real need underneath a request and giving a team a direction it can act on.</p></div><div class="answer-landmark"><span class="eyebrow">02 / Evidence</span><p>That is why this role stands out to me: it combines direct user contact with the chance to turn evidence into product decisions. In my internship, I ran 12 usability sessions, helped reduce task failure from 40 percent to 18 percent, and used AI to make the research workflow faster without handing over the judgment.</p></div></div></div></div>`);
    html = html.replaceAll("Won't AI just do this job?", "Practice the questions employers actually ask.");
    html = html
      .replaceAll("“Practice the questions employers actually ask.”", "Practice the questions employers actually ask.")
      .replaceAll("Someone will ask, in an interview or in your own head at 2am. Here is the answer built out of what you have actually done, not out of reassurance.", "Build clear answers around your real evidence: a concise introduction, a behavioural example, and a role-specific response for UX research.")
      .replaceAll("“So why hire a junior at all?”", "“Tell me about a time your research changed a product decision.”")
      .replaceAll("Because the automatable half now costs almost nothing, which means the judgment half is most of what you are paying for. I have been practising that half in public since sophomore year, and I can show you the work.", "Lead with the 12 usability sessions, describe the pattern you surfaced, and land on the 40-to-18 percent task-failure result.")
      .replaceAll("“What happens when the tools get better?”", "“How would you approach an ambiguous usability question for our product team?”")
      .replaceAll("Then my share of the automatable work shrinks again and I move further into framing and deciding. I am tracking that number rather than hoping about it, which is why I can tell you it is about half today.", "Start with the user and the decision at stake, choose the fastest appropriate research method, then show how you would turn the findings into a recommendation.");
  }

  if (fileName === "roadmap.html") {
    html = html.replace(/<style id="cairn-smooth-roadmap">[\s\S]*?<\/style>/, smoothRoadmapCss);
    if (!html.includes('cairn-smooth-roadmap')) html = html.replace("</head>", `${smoothRoadmapCss}</head>`);
    html = html.replace('if(e.isIntersecting){r.classList.add("go")}else{r.classList.remove("go")}', 'if(e.isIntersecting){r.classList.add("go");io.unobserve(r)}');
  }

  if (fileName === "cleanup.html") {
    const privacyPanelStart = html.indexOf('<div class="sec"><div class="card lime"><span class="eyebrow">The walls around this</span>');
    const privacyPanelEnd = html.indexOf('<div class="sources" id="src">', privacyPanelStart);
    if (privacyPanelStart !== -1 && privacyPanelEnd !== -1) {
      html = html.slice(0, privacyPanelStart) + html.slice(privacyPanelEnd);
    }
  }

  if (!html.includes('id="totop"')) {
    html = html.replace("</body>", `${backToTopMarkup}</body>`);
  }

  writeFileSync(filePath, html);
}

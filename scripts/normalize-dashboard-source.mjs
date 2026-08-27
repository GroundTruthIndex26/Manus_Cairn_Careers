import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dashboardDir = new URL("../dashboard-preview/", import.meta.url);

for (const fileName of readdirSync(dashboardDir)) {
  if (!fileName.endsWith(".html")) continue;

  const filePath = join(dashboardDir.pathname, fileName);
  let html = readFileSync(filePath, "utf8");

  html = html
    .replace(/(<a class="brand" href=")[^"]*(")/g, '$1../index.html#top$2')
    .replaceAll('href="https://cairncareers.com/#preorder-checkout"', 'href="../index.html#pricing"')
    .replace("</head>", '<link rel="icon" href="../brand/cairn-favicon.svg" type="image/svg+xml" sizes="any"></head>');

  if (fileName === "interview.html") {
    html = html.replaceAll("Won't AI just do this job?", "Practice the questions employers actually ask.");
  }

  writeFileSync(filePath, html);
}

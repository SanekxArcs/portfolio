import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portfolio = resolve(root, "..");
for (const folder of ["public/brand", "public/projects", "public/fonts"]) {
  mkdirSync(resolve(root, folder), { recursive: true });
}
copyFileSync(
  resolve(portfolio, "public/logo.svg"),
  resolve(root, "public/brand/logo.svg"),
);
const svg = readFileSync(resolve(portfolio, "public/logo.svg"), "utf8");
writeFileSync(
  resolve(root, "public/brand/logo-mint.svg"),
  svg.replaceAll("#000000", "#a2f2c8"),
);
writeFileSync(
  resolve(root, "public/brand/logo-dark.svg"),
  svg.replaceAll("#000000", "#0b1511"),
);
writeFileSync(
  resolve(root, "src/logo-svg.json"),
  JSON.stringify(readFileSync(resolve(portfolio, "public/logo.svg"), "utf8")),
);
for (const id of [
  "solar-sense",
  "feigin-electric",
  "erm-system",
  "work-buddy",
]) {
  copyFileSync(
    resolve(portfolio, `public/content/project-${id}-desktop.webp`),
    resolve(root, `public/projects/${id}.webp`),
  );
}
copyFileSync(
  resolve(portfolio, "public/content/project-solar-sense-mobile.webp"),
  resolve(root, "public/projects/solar-sense-mobile.webp"),
);
copyFileSync(
  resolve(portfolio, "public/content/project-feigin-electric-mobile.webp"),
  resolve(root, "public/projects/feigin-electric-mobile.webp"),
);
const profile = JSON.parse(
  readFileSync(resolve(portfolio, "content/profile.json"), "utf8"),
);
execFileSync("ffmpeg", [
  "-y",
  "-v",
  "error",
  "-i",
  resolve(portfolio, `public${profile.profilePhotoUrl}`),
  "-vf",
  "scale=900:900",
  "-c:v",
  "libwebp",
  "-quality",
  "90",
  resolve(root, "public/brand/portrait.webp"),
]);
// The same variable Noto Sans used by the website; includes all English glyphs.
copyFileSync(
  resolve(
    portfolio,
    ".next/static/media/dc6d2a64e9dbf3bc-s.p.3mjzw95c0-_52.woff2",
  ),
  resolve(root, "public/fonts/noto-sans-latin.woff2"),
);
console.log(
  "Copied the original logo, portrait, real project captures, and website font.",
);
copyFileSync(
  resolve(
    portfolio,
    ".next/static/media/05ce0245cbf07d46-s.p.1__0ydqd-xg_4.woff2",
  ),
  resolve(root, "public/fonts/noto-sans-latin-ext.woff2"),
);

import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locale = process.argv[3] || "en";
if (!["en", "pl"].includes(locale)) throw new Error("Choose en or pl");
const tag = locale === "pl" ? "pl-" : "";
const timingFile = locale === "pl" ? "src/timing-pl.json" : "src/timing.json";
const out = resolve(root, "out");
mkdirSync(out, { recursive: true });
const candidates = [process.env.CHROME_PATH];
const playwright = join(process.env.LOCALAPPDATA || "", "ms-playwright");
if (existsSync(playwright)) {
  for (const folder of readdirSync(playwright)
    .filter((name) => /^chromium-\d+$/.test(name))
    .sort()
    .reverse()) {
    candidates.push(join(playwright, folder, "chrome-win64", "chrome.exe"));
  }
}
const browserExecutable = candidates.find(
  (candidate) => candidate && existsSync(candidate),
);
const browser = { browserExecutable, chromiumOptions: { gl: "angle" } };
console.log("Bundling the studio film...");
const serveUrl = await bundle({
  entryPoint: resolve(root, "src/index.ts"),
  publicDir: resolve(root, "public"),
});
const compositions = await getCompositions(serveUrl, browser);
const mode = process.argv[2] || "all";
const results = [];
for (const baseId of ["StudioWide", "StudioVertical"]) {
  const id = baseId + (locale === "pl" ? "PL" : "");
  const composition = compositions.find((item) => item.id === id);
  if (!composition) throw new Error(`Missing composition: ${id}`);
  const portrait = baseId === "StudioVertical";
  const suffix = portrait ? "vertical" : "wide";
  if (mode === "stills") {
    const edit = JSON.parse(
      (await import("node:fs")).readFileSync(resolve(root, timingFile), "utf8"),
    );
    const frames = edit.scenes.map(
      (scene) => scene.from + Math.min(100, scene.duration - 20),
    );
    for (let index = 0; index < frames.length; index++) {
      const output = resolve(out, `review-${tag}${suffix}-${index + 1}.png`);
      await renderStill({
        serveUrl,
        composition,
        output,
        frame: frames[index],
        ...browser,
      });
      console.log(`Frame ${index + 1}: ${output}`);
    }
  } else if (mode === "all" || mode === suffix) {
    const output = resolve(out, `od-empower-${tag}${suffix}.mp4`);
    let last = -1;
    await renderMedia({
      serveUrl,
      composition,
      outputLocation: output,
      codec: "h264",
      crf: 18,
      pixelFormat: "yuv420p",
      audioBitrate: "256k",
      concurrency: 3,
      ...browser,
      onProgress: ({ progress }) => {
        const percent = Math.floor((progress * 100) / 10) * 10;
        if (percent !== last) {
          last = percent;
          console.log(`${id}: ${percent}%`);
        }
      },
    });
    results.push({
      id,
      output,
      width: composition.width,
      height: composition.height,
      seconds: composition.durationInFrames / composition.fps,
    });
    console.log(`Exported: ${output}`);
  }
}
if (mode !== "stills") {
  const composition = compositions.find(
    (item) => item.id === (locale === "pl" ? "StudioWidePL" : "StudioWide"),
  );
  const edit = JSON.parse(
    (await import("node:fs")).readFileSync(resolve(root, timingFile), "utf8"),
  );
  await renderStill({
    serveUrl,
    composition,
    output: resolve(out, `od-empower-${tag}poster.png`),
    frame: edit.scenes.at(-1).from + 115,
    ...browser,
  });
  writeFileSync(
    resolve(out, `render-report-${locale}.json`),
    JSON.stringify(results, null, 2) + "\n",
  );
}

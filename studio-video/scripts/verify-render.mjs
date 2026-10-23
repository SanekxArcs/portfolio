import { execFileSync } from "node:child_process";
import { statSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locale = process.argv[2] || "en";
if (!["en", "pl"].includes(locale)) throw new Error("Choose en or pl");
const tag = locale === "pl" ? "pl-" : "";
const edit = JSON.parse(
  readFileSync(
    resolve(root, locale === "pl" ? "src/timing-pl.json" : "src/timing.json"),
    "utf8",
  ),
);
const results = [];
for (const [format, width, height] of [
  ["wide", 1920, 1080],
  ["vertical", 1080, 1920],
]) {
  const file = resolve(root, `out/od-empower-${tag}${format}.mp4`);
  const data = JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
      { encoding: "utf8" },
    ),
  );
  const video = data.streams.find((stream) => stream.codec_type === "video");
  const audio = data.streams.find((stream) => stream.codec_type === "audio");
  if (!video || !audio) throw new Error(`${format}: missing video or audio`);
  if (
    video.width !== width ||
    video.height !== height ||
    video.avg_frame_rate !== "30/1"
  )
    throw new Error(`${format}: unexpected dimensions or frame rate`);
  if (
    Math.abs(Number(data.format.duration) - edit.durationInFrames / edit.fps) >
    0.12
  )
    throw new Error(`${format}: wrong runtime`);
  // Decode every frame and audio packet: a valid header alone is not enough.
  execFileSync("ffmpeg", ["-v", "error", "-i", file, "-f", "null", "-"]);
  const selected = edit.scenes
    .map((scene) => `eq(n,${scene.from + Math.min(100, scene.duration - 20)})`)
    .join("+");
  const scale = format === "wide" ? "640:360" : "360:640";
  const grid = format === "wide" ? "2x3" : "3x2";
  execFileSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    file,
    "-vf",
    `select='${selected}',scale=${scale},tile=${grid}`,
    "-frames:v",
    "1",
    resolve(root, `out/final-${tag}${format}-contact-sheet.jpg`),
  ]);
  results.push({
    format,
    width,
    height,
    fps: 30,
    seconds: Number(data.format.duration),
    video: video.codec_name,
    audio: audio.codec_name,
    megabytes: Math.round((statSync(file).size / 1024 / 1024) * 10) / 10,
    fullDecode: "passed",
  });
}
writeFileSync(
  resolve(root, `out/verification-${locale}.json`),
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));

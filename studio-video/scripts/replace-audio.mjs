import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const edit = JSON.parse(readFileSync(resolve(root, "src/timing.json"), "utf8"));
const seconds = edit.durationInFrames / edit.fps;
const source = resolve(root, "public/audio/soundtrack.m4a");
const report = [];
const revision = process.argv[2] || "v2";
if (!/^v\d+$/.test(revision)) throw new Error("Use a revision such as v3");
const videoHash = (file) =>
  execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-i",
      file,
      "-map",
      "0:v:0",
      "-c",
      "copy",
      "-f",
      "hash",
      "-hash",
      "sha256",
      "-",
    ],
    { encoding: "utf8" },
  ).trim();

for (const format of ["wide", "vertical"]) {
  const original = resolve(root, `out/od-empower-${format}.mp4`);
  const revised = resolve(root, `out/od-empower-${format}-${revision}.mp4`);
  const info = JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_format", "-of", "json", original],
      { encoding: "utf8" },
    ),
  );
  if (Math.abs(Number(info.format.duration) - seconds) > 0.12)
    throw new Error(
      "The edit length changed. Render the visuals again before replacing audio.",
    );
  const before = videoHash(original);
  execFileSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    original,
    "-i",
    source,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c",
    "copy",
    "-t",
    String(seconds),
    "-movflags",
    "+faststart",
    revised,
  ]);
  const after = videoHash(revised);
  if (before !== after) throw new Error(`Video data changed in ${format}`);
  execFileSync("ffmpeg", ["-v", "error", "-i", revised, "-f", "null", "-"]);
  copyFileSync(revised, original);
  report.push({
    format,
    output: revised,
    seconds,
    videoPayloadIdentical: true,
    fullDecode: "passed",
  });
  console.log(`Updated ${format}: identical video, corrected soundtrack`);
}
const personal = edit.scenes.find((scene) => scene.id === "personal");
execFileSync("ffmpeg", [
  "-y",
  "-v",
  "error",
  "-ss",
  String(personal.from / edit.fps),
  "-i",
  resolve(root, "out/audio/voice.wav"),
  "-t",
  String(seconds - personal.from / edit.fps),
  "-c:a",
  "libmp3lame",
  "-b:a",
  "192k",
  resolve(root, `out/od-empower-voice-review-${revision}.mp3`),
]);
copyFileSync(
  resolve(root, `out/od-empower-voice-review-${revision}.mp3`),
  resolve(root, "out/od-empower-voice-review.mp3"),
);
writeFileSync(
  resolve(root, "out/audio-revision-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);

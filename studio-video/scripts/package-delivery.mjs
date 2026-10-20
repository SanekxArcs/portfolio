import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "out/delivery");
mkdirSync(destination, { recursive: true });
for (const [source, name] of [
  ["od-empower-wide.mp4", "od-empower-en-horizontal.mp4"],
  ["od-empower-vertical.mp4", "od-empower-en-vertical.mp4"],
  ["od-empower-pl-wide.mp4", "od-empower-pl-horizontal.mp4"],
  ["od-empower-pl-vertical.mp4", "od-empower-pl-vertical.mp4"],
  ["od-empower-en.srt", "od-empower-en.srt"],
  ["od-empower-pl.srt", "od-empower-pl.srt"],
]) {
  copyFileSync(resolve(root, "out", source), resolve(destination, name));
  console.log(name);
}
writeFileSync(
  resolve(destination, "README.txt"),
  "O.D. EMPOWER studio promo\n\n" +
    "English: 36 seconds. Polish: 38.5 seconds.\n" +
    "Horizontal: 1920 x 1080 (16:9). Vertical: 1080 x 1920 (9:16).\n" +
    "All four videos include narration, original music and effects.\n" +
    "MP4 / H.264 / AAC / 30 fps. SRT captions are optional.\n" +
    "The English introduction uses: I'm your developer.\n",
);

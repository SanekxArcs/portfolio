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
  ["od-empower-ua-wide.mp4", "od-empower-ua-horizontal.mp4"],
  ["od-empower-ua-vertical.mp4", "od-empower-ua-vertical.mp4"],
]) {
  copyFileSync(resolve(root, "out", source), resolve(destination, name));
  console.log(name);
}
writeFileSync(
  resolve(destination, "README.txt"),
  "O.D. EMPOWER studio promo\n\n" +
    "English, Polish and Ukrainian: 24.3 seconds each, cut to a 128.6 BPM score.\n" +
    "Horizontal: 1920 x 1080 (16:9). Vertical: 1080 x 1920 (9:16).\n" +
    "No narration: the on-screen type carries the message, so it works muted.\n" +
    "MP4 / H.264 / AAC / 30 fps. Original synthesised music and effects.\n",
);

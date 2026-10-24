import { Easing, interpolate, useVideoConfig } from "remotion";
import edit from "./edit.json";

export const color = {
  ink: "#0b1511",
  deep: "#06100c",
  mint: "#a2f2c8",
  green: "#00b87a",
  paper: "#f1f4eb",
  muted: "#8fa398",
};
export const font = "StudioSans, sans-serif";
export const BEAT = edit.beatFrames;
export const BAR = BEAT * 4;
export const section = (id: string) => {
  const found = edit.sections.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown section ${id}`);
  return { from: found.from, duration: found.beats * BEAT };
};

// Fast attack, long settle: reads as "hit" rather than "glide".
export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const snap = Easing.bezier(0.7, 0, 0.2, 1);
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const enter = (frame: number, delay = 0, duration = 10) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    ...clamp,
    easing: expoOut,
  });
/** 1 on the beat, decaying to 0 before the next one. */
export const pulse = (frame: number, decay = 3.2) =>
  frame < 0 ? 0 : Math.exp(-(frame % BEAT) / decay);
/** Seeded noise so shakes and jitter are identical on every render. */
export const noise = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const useFormat = () => {
  const { width, height } = useVideoConfig();
  return { portrait: height > width, width, height };
};

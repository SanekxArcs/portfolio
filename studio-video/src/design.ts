import { Easing, interpolate } from "remotion";

export const color = {
  ink: "#0b1511",
  dark: "#101f18",
  mint: "#a2f2c8",
  green: "#00b87a",
  paper: "#f1f4eb",
  muted: "#a6b5ab",
};
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const enter = (frame: number, delay = 0, duration = 26) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    ...clamp,
    easing: ease,
  });

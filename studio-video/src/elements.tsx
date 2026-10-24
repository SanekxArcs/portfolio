import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp, color, expoOut, font } from "./design";

/** Film grain: a new noise seed each frame, so it crawls like real stock. */
export const Grain = ({ opacity = 0.09 }: { opacity?: number }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={frame % 24}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette = ({ strength = 0.3 }: { strength?: number }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/**
 * A word that lands on the beat: it arrives oversized and blurred, then locks
 * into place within a few frames.
 */
export const Slam = ({
  children,
  at = 0,
  size,
  style,
  from = 1.35,
}: {
  children: ReactNode;
  at?: number;
  size: number;
  style?: CSSProperties;
  from?: number;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 7], [0, 1], {
    ...clamp,
    easing: expoOut,
  });
  return (
    <div
      style={{
        // Hidden words still hold their place, so a line never reflows.
        visibility: frame < at ? "hidden" : undefined,
        fontFamily: font,
        fontWeight: 850,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: `${-0.055 - (1 - t) * 0.04}em`,
        whiteSpace: "nowrap",
        scale: from - (from - 1) * t,
        filter: t < 0.98 ? `blur(${(1 - t) * 14}px)` : undefined,
        transformOrigin: "50% 60%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Rough fit for the heavy, tightly tracked display weight. */
export const fit = (text: string, maxWidth: number, maxSize: number) =>
  Math.min(maxSize, maxWidth / (text.length * 0.52));

export const Shot = ({
  src,
  width,
  height,
  style,
  radius = 18,
  position = "top",
}: {
  src: string;
  width: number;
  height: number;
  style?: CSSProperties;
  radius?: number;
  position?: string;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      overflow: "hidden",
      background: color.deep,
      boxShadow:
        "0 50px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.12)",
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
      }}
    />
  </div>
);

export const Phone = ({
  src,
  width,
  style,
}: {
  src: string;
  width: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      width,
      height: width * 2.08,
      borderRadius: width * 0.16,
      padding: width * 0.035,
      background: "#111a15",
      boxShadow:
        "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.14)",
      ...style,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: width * 0.13,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
    </div>
  </div>
);

export const Arrow = ({
  size = 58,
  stroke = "currentColor",
  style,
}: {
  size?: number;
  stroke?: string;
  style?: CSSProperties;
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
    <path
      d="M12 49 50 11M15 11h35v35"
      stroke={stroke}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NodeIcon = ({ kind, stroke }: { kind: number; stroke: string }) => (
  <g
    stroke={stroke}
    strokeWidth="3.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === 0 ? (
      <>
        <path d="M8 24h44l-5 31H13L8 24Z" />
        <path d="m18 24 8-17m16 17L34 7M23 35v10m14-10v10" />
      </>
    ) : kind === 1 ? (
      <>
        <ellipse cx="30" cy="12" rx="22" ry="8" />
        <path d="M8 12v33c0 11 44 11 44 0V12M8 28c0 11 44 11 44 0" />
      </>
    ) : (
      <>
        <circle cx="30" cy="17" r="10" />
        <path d="M10 53v-8c0-17 40-17 40 0v8M10 12a8 8 0 0 0 0 16M50 12a8 8 0 0 1 0 16" />
      </>
    )}
  </g>
);

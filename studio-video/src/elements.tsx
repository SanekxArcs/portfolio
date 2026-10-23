import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, color, ease } from "./design";
import { useFilmCopy } from "./i18n";

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
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Title = ({
  lines,
  size = 150,
  accent,
  delay = 7,
  style,
}: {
  lines: string[];
  size?: number;
  accent?: number;
  delay?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontWeight: 750,
        fontSize: size,
        lineHeight: 1.045,
        letterSpacing: "-.05em",
        ...style,
      }}
    >
      {lines.map((line, index) => (
        <div
          key={line}
          style={{
            overflow: "hidden",
            paddingBottom: ".12em",
            marginBottom: "-.12em",
          }}
        >
          <div
            style={{
              color: accent === index ? color.mint : undefined,
              translate: `0 ${interpolate(frame, [delay + index * 5, delay + index * 5 + 27], [115, 0], { ...clamp, easing: ease })}%`,
              rotate: `${interpolate(frame, [delay + index * 5, delay + index * 5 + 27], [3, 0], { ...clamp, easing: ease })}deg`,
              transformOrigin: "0 100%",
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Frame = ({
  children,
  theme = "dark",
  number,
  label,
}: {
  children: ReactNode;
  theme?: "dark" | "paper" | "mint";
  number: string;
  label: string;
}) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const copy = useFilmCopy();
  const light = theme !== "dark";
  const foreground = light ? color.ink : color.paper;
  return (
    <AbsoluteFill
      style={{
        background:
          theme === "dark"
            ? color.ink
            : theme === "paper"
              ? color.paper
              : color.mint,
        color: foreground,
        padding: portrait ? "100px 82px 100px" : "58px 96px 56px",
        fontFamily: "StudioSans, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          height: 52,
          flexShrink: 0,
          fontSize: portrait ? 28 : 25,
          fontWeight: 650,
          letterSpacing: "-.025em",
          zIndex: 3,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img
            src={staticFile(`brand/logo-${light ? "dark" : "mint"}.svg`)}
            style={{ width: 38, height: 45 }}
          />
          <span>O.D. EMPOWER</span>
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 450,
            letterSpacing: ".13em",
            opacity: 0.55,
          }}
        >
          {copy.header[portrait ? 0 : 1]}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          fontSize: portrait ? 25 : 22,
          letterSpacing: ".08em",
          fontWeight: 500,
          opacity: 0.65,
          flexShrink: 0,
          paddingTop: 22,
          zIndex: 3,
        }}
      >
        <span>
          {number} / {label}
        </span>
        <span>o-d.dev</span>
      </div>
    </AbsoluteFill>
  );
};

export const Browser = ({
  project,
  url,
  width,
  height,
  style,
  children,
}: {
  project: string;
  url: string;
  width: number;
  height: number;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      flexDirection: "column",
      background: "#17261d",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 35px 100px #00150f38, 0 0 0 1px #ffffff22",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "0 18px",
        background: "#19291f",
        flexShrink: 0,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: i === 0 ? "#a2f2c8" : "#ffffff35",
          }}
        />
      ))}
      <div
        style={{
          margin: "0 auto",
          fontSize: 17,
          letterSpacing: ".03em",
          color: "#b7c8bd",
          paddingRight: 42,
        }}
      >
        {url}
      </div>
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        position: "relative",
        background: project === "work-buddy" ? "#080909" : "#f3f5ef",
      }}
    >
      <Img
        src={staticFile(`projects/${project}.webp`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: project === "work-buddy" ? "contain" : "cover",
          objectPosition: project === "work-buddy" ? "center" : "top",
        }}
      />
      {children}
    </div>
  </div>
);

export const Grid = ({ light = false }: { light?: boolean }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: light ? 0.09 : 0.08,
        backgroundImage: `linear-gradient(${light ? "#005f39" : "#a2f2c8"} 1px,transparent 1px),linear-gradient(90deg,${light ? "#005f39" : "#a2f2c8"} 1px,transparent 1px)`,
        backgroundSize: "100px 100px",
        transform: `perspective(1000px) rotateX(55deg) scale(2.1) translateY(${frame * 0.05}px)`,
        maskImage: "radial-gradient(ellipse at center,black,transparent 66%)",
      }}
    />
  );
};

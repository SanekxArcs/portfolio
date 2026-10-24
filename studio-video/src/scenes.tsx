import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BrandModel } from "./BrandModel";
import { Arrow, NodeIcon, Phone, Shot, Slam, fit } from "./elements";
import {
  BEAT,
  clamp,
  color,
  enter,
  expoOut,
  font,
  pulse,
  snap,
  useFormat,
} from "./design";
import { useFilmCopy } from "./i18n";

const fill = (background: string, foreground: string): CSSProperties => ({
  background,
  color: foreground,
  fontFamily: font,
  overflow: "hidden",
});

/** A line that rises out of a mask. */
const Rise = ({
  children,
  at,
  style,
}: {
  children: ReactNode;
  at: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 12], [0, 1], {
    ...clamp,
    easing: expoOut,
  });
  return (
    <div style={{ overflow: "hidden", paddingBottom: ".1em", ...style }}>
      <div style={{ translate: `0 ${(1 - t) * 110}%`, rotate: `${(1 - t) * 4}deg`, transformOrigin: "0 100%" }}>
        {children}
      </div>
    </div>
  );
};

const Tag = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      position: "absolute",
      fontFamily: font,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

// Accelerating curve for the rush into the drop.
const Easing3 = (t: number) => t * t * t;

export const Hook = () => {
  const f = useCurrentFrame();
  const copy = useFilmCopy();
  const { portrait } = useFormat();
  const second = f >= BEAT * 4;
  const words = copy.hook[second ? 1 : 0];
  const start = second ? BEAT * 4 : 0;
  // Last beat: the line rushes past the camera into the drop.
  const rush = interpolate(f, [BEAT * 7, BEAT * 8], [0, 1], {
    ...clamp,
    easing: Easing3,
  });
  const lineSize = portrait
    ? Math.min(...words.map((word) => fit(word, 900, 300)))
    : fit(words.join(" "), 1650, 330);
  const accentBeat = interpolate(f, [BEAT * 3, BEAT * 3 + 6], [1.06, 1], clamp);
  return (
    <AbsoluteFill style={fill(second ? color.mint : color.ink, second ? color.ink : color.paper)}>
      <Tag style={{ left: portrait ? 80 : 96, top: portrait ? 110 : 70, opacity: 0.6 }}>
        O.D. Empower
      </Tag>
      <AbsoluteFill
        style={{
          alignItems: portrait ? "flex-start" : "center",
          justifyContent: "center",
          padding: portrait ? "0 80px" : 0,
          scale: 1 + rush * 5 + (f >= BEAT * 3 && f < BEAT * 4 ? accentBeat - 1 : 0),
          filter: rush > 0 ? `blur(${rush * 30}px)` : undefined,
          opacity: 1 - rush * 0.8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            gap: portrait ? 0 : "0.24em",
            fontSize: lineSize,
          }}
        >
          {words.map((word, index) => (
            <Slam
              key={word}
              at={start + index * BEAT}
              size={lineSize}
              style={{
                color:
                  index === words.length - 1 && !second ? color.mint : undefined,
              }}
            >
              {word}
            </Slam>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Marquee = ({
  text,
  size,
  y,
  speed,
  solid = false,
}: {
  text: string;
  size: number;
  y: number;
  speed: number;
  solid?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        whiteSpace: "nowrap",
        fontSize: size,
        fontWeight: 850,
        letterSpacing: "-.05em",
        lineHeight: 1,
        translate: `${((f * speed) % (size * 6)) - size * 6}px 0`,
        color: solid ? color.mint : "transparent",
        WebkitTextStroke: solid ? undefined : `2px ${color.mint}`,
        opacity: solid ? 0.95 : 0.3,
      }}
    >
      {Array.from({ length: 6 }, () => text).join("  ")}
    </div>
  );
};

export const Drop = () => {
  const { portrait, width, height } = useFormat();
  const size = portrait ? 230 : 250;
  const rows = portrait ? 7 : 4;
  const gap = height / rows;
  const model = portrait ? 980 : 900;
  return (
    <AbsoluteFill style={fill(color.ink, color.paper)}>
      {Array.from({ length: rows }, (_, i) => (
        <Marquee
          key={i}
          text="O.D. EMPOWER —"
          size={size}
          y={i * gap + (gap - size) / 2}
          speed={i % 2 ? 46 : -46}
        />
      ))}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color.ink} 0%, ${color.ink}cc 28%, transparent 62%)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: model, height: model, maxWidth: width }}>
          <BrandModel size={model} beat />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type ReelShot = { id: string; name: string; beats: number; mobile?: boolean };

export const Reel = ({
  label,
  shots,
  offset,
  total,
}: {
  label: string;
  shots: ReelShot[];
  offset: number;
  total: number;
}) => {
  const f = useCurrentFrame();
  const { portrait } = useFormat();
  let start = 0;
  let index = 0;
  for (; index < shots.length - 1; index++) {
    const length = shots[index].beats * BEAT;
    if (f < start + length) break;
    start += length;
  }
  const shot = shots[index];
  const lf = f - start;
  const variant = (index + offset) % 4;
  const t = enter(lf, 0, 9);
  const blur = (1 - t) * 22;
  const drift = 1 + lf * 0.0012;
  const transforms = [
    { x: 560 * (1 - t), y: 0, ry: -24 + 14 * t, rx: 4, s: 1 },
    { x: 0, y: 0, ry: 0, rx: 0, s: 1.35 - 0.35 * t },
    { x: 0, y: 520 * (1 - t), ry: 0, rx: 26 - 18 * t, s: 1 },
    { x: -560 * (1 - t), y: 0, ry: 24 - 14 * t, rx: 4, s: 1 },
  ][variant];
  const wordSize = portrait ? fit(label, 920, 220) : fit(label, 1300, 290);
  const cardTransform: CSSProperties = {
    transform: `perspective(2200px) rotateY(${transforms.ry}deg) rotateX(${transforms.rx}deg)`,
    translate: `${transforms.x}px ${transforms.y}px`,
    scale: transforms.s * drift,
    filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
  };
  const showPhone = shot.mobile && shot.beats > 1;
  return (
    <AbsoluteFill style={fill(color.deep, color.paper)}>
      <AbsoluteFill style={{ scale: 1.25 }}>
        <Img
          src={staticFile(`reel/${shot.id}.webp`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(60px) brightness(.32) saturate(1.4)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {portrait && shot.mobile ? (
          <div style={{ ...cardTransform, marginTop: -120 }}>
            <Phone src={`reel/${shot.id}-mobile.webp`} width={560} />
          </div>
        ) : (
          <div style={{ ...cardTransform, marginLeft: portrait ? 0 : 230, marginTop: portrait ? -160 : -150 }}>
            <Shot
              src={`reel/${shot.id}.webp`}
              width={portrait ? 960 : 1180}
              height={portrait ? 1100 : 800}
              position={portrait ? "left top" : "top"}
            />
          </div>
        )}
        {showPhone && !portrait && (
          <div
            style={{
              position: "absolute",
              right: 190,
              bottom: 70,
              translate: `0 ${(1 - enter(lf, BEAT, 9)) * 700}px`,
              rotate: `${6 - enter(lf, BEAT, 9) * 2}deg`,
            }}
          >
            <Phone src={`reel/${shot.id}-mobile.webp`} width={250} />
          </div>
        )}
      </AbsoluteFill>
      <Tag style={{ left: portrait ? 80 : 96, top: portrait ? 110 : 70 }}>
        <span style={{ color: color.mint }}>
          {String(offset + index + 1).padStart(2, "0")}
        </span>
        <span style={{ opacity: 0.45 }}> / {total}</span>
        <span style={{ marginLeft: 22 }}>{shot.name}</span>
      </Tag>
      <div
        style={{
          position: "absolute",
          left: portrait ? 70 : 84,
          bottom: portrait ? 150 : 40,
          color: color.paper,
          textShadow: "0 12px 60px rgba(0,0,0,.55)",
          scale: 1 + pulse(lf, 2.5) * 0.025,
          transformOrigin: "0 100%",
        }}
      >
        <Slam at={0} size={wordSize} from={1.15}>
          {label}
        </Slam>
      </div>
    </AbsoluteFill>
  );
};

export const Connected = () => {
  const f = useCurrentFrame();
  const copy = useFilmCopy();
  const { portrait } = useFormat();
  const step = Math.min(3, Math.floor(f / BEAT));
  const all = step === 3;
  const word = copy.connected[step];
  const size = portrait ? fit(word, 920, 210) : fit(word, 1640, 250);
  const nodes = [300, 800, 1300];
  const line = all ? color.ink : color.mint;
  return (
    <AbsoluteFill style={fill(all ? color.mint : color.ink, all ? color.ink : color.paper)}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: portrait ? 520 : 200,
        }}
      >
        <Slam key={step} at={step * BEAT} size={size}>
          {word}
        </Slam>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: portrait ? 560 : 150,
        }}
      >
        <svg
          width={portrait ? 1040 : 1600}
          viewBox="0 0 1600 420"
          style={{ overflow: "visible" }}
        >
          {[0, 1].map((i) => {
            const drawn = interpolate(f, [(i + 1) * BEAT, (i + 1) * BEAT + 9], [0, 1], {
              ...clamp,
              easing: expoOut,
            });
            const x1 = nodes[i] + 130;
            const x2 = nodes[i + 1] - 130;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  x2={x1 + (x2 - x1) * drawn}
                  y1={180}
                  y2={180}
                  stroke={line}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                {drawn >= 1 &&
                  [0, 1, 2].map((j) => {
                    const p = (f * 0.07 + j / 3 + i * 0.2) % 1;
                    return (
                      <circle
                        key={j}
                        cx={x1 + (x2 - x1) * p}
                        cy={180}
                        r={9}
                        fill={line}
                      />
                    );
                  })}
              </g>
            );
          })}
          {nodes.map((x, i) => {
            const pop = enter(f, i * BEAT, 8);
            const lit = all || step === i;
            return (
              <g
                key={x}
                transform={`translate(${x} 180) scale(${0.6 + pop * 0.4 + (lit ? pulse(f, 2.5) * 0.06 : 0)})`}
                opacity={pop}
              >
                <rect
                  x={-130}
                  y={-130}
                  width={260}
                  height={260}
                  rx={48}
                  fill={all ? color.ink : lit ? color.mint : "#13241b"}
                  stroke={all || lit ? "none" : "#a2f2c855"}
                  strokeWidth={2}
                />
                <g transform="translate(-45 -60) scale(1.5)">
                  <NodeIcon kind={i} stroke={all ? color.mint : lit ? color.ink : color.mint} />
                </g>
                <text
                  y={200}
                  textAnchor="middle"
                  fontSize={38}
                  fontWeight={700}
                  fontFamily={font}
                  letterSpacing={1}
                  fill={all ? color.ink : color.paper}
                >
                  {copy.nodes[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Breakdown = () => {
  const f = useCurrentFrame();
  const copy = useFilmCopy();
  const { portrait } = useFormat();
  const reveal = interpolate(f, [0, 16], [100, 0], { ...clamp, easing: snap });
  // The last beat pushes in, setting up the final drop.
  const push = interpolate(f, [BEAT * 6, BEAT * 8], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const longest = copy.breakdown.reduce((a, b) => (a.length > b.length ? a : b));
  const size = portrait ? fit(longest, 920, 120) : fit(longest, 1000, 150);
  return (
    <AbsoluteFill
      style={{
        ...fill(color.ink, color.paper),
        background: `radial-gradient(ellipse at ${portrait ? "50% 30%" : "75% 50%"}, #123224 0%, ${color.ink} 60%)`,
        scale: 1 + push * 0.12,
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(portrait
            ? { left: 140, top: 170, width: 800, height: 900 }
            : { right: 150, top: 120, width: 660, height: 840 }),
          clipPath: `inset(${reveal}% 0 0 0 round 28px)`,
          overflow: "hidden",
          borderRadius: 28,
        }}
      >
        <Img
          src={staticFile("brand/portrait.webp")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 35%",
            scale: 1.25 - enter(f, 0, 40) * 0.17 + f * 0.0006,
            filter: "contrast(1.06) saturate(.92)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          ...(portrait ? { left: 80, top: 1140 } : { left: 140, top: 300 }),
          fontSize: size,
          fontWeight: 850,
          letterSpacing: "-.05em",
          lineHeight: 1,
        }}
      >
        <Rise at={2}>{copy.breakdown[0]}</Rise>
        <Rise at={BEAT * 2} style={{ color: color.mint }}>
          {copy.breakdown[1]}
        </Rise>
        <Rise at={BEAT * 4} style={{ fontSize: portrait ? 50 : 48, fontWeight: 650, letterSpacing: "-.02em", marginTop: portrait ? 50 : 70 }}>
          Oleksandr Dzisiak
        </Rise>
        <Rise at={BEAT * 4 + 5} style={{ fontSize: portrait ? 28 : 26, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: color.muted, marginTop: 14 }}>
          {copy.role}
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

const recap = [
  "feigin-electric",
  "work-buddy",
  "love-notes",
  "tunerfest",
  "liberty-immigration",
  "cusemit",
  "movie-browser",
];

export const Finale = () => {
  const f = useCurrentFrame();
  const copy = useFilmCopy();
  const { portrait } = useFormat();
  const step = Math.floor(f / BEAT);
  if (step >= 3) {
    // Two frames per project: a strobe recap of everything we just saw.
    const id = recap[Math.min(recap.length - 1, Math.floor((f - BEAT * 3) / 2))];
    return (
      <AbsoluteFill style={{ background: color.ink }}>
        <Img
          src={staticFile(`reel/${id}.webp`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      </AbsoluteFill>
    );
  }
  const palette = [
    [color.ink, color.mint],
    [color.mint, color.ink],
    [color.paper, color.ink],
  ][step];
  const word = copy.finale[step];
  const size = portrait ? fit(word, 940, 420) : fit(word, 1700, 560);
  return (
    <AbsoluteFill style={{ ...fill(palette[0], palette[1]), alignItems: "center", justifyContent: "center" }}>
      <Slam key={step} at={step * BEAT} size={size} from={1.5}>
        {word}
      </Slam>
    </AbsoluteFill>
  );
};

export const Cta = () => {
  const f = useCurrentFrame();
  const copy = useFilmCopy();
  const { portrait } = useFormat();
  const line = interpolate(f, [12, 34], [0, 1], { ...clamp, easing: expoOut });
  const model = portrait ? 760 : 700;
  return (
    <AbsoluteFill
      style={{
        ...fill(color.ink, color.paper),
        background: `radial-gradient(ellipse at ${portrait ? "50% 28%" : "28% 50%"}, #10301f 0%, ${color.ink} 55%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          ...(portrait
            ? { left: (1080 - model) / 2, top: 170 }
            : { left: 110, top: (1080 - model) / 2 }),
          width: model,
          height: model,
        }}
      >
        <BrandModel size={model} beat={f < BEAT * 4} />
      </div>
      <div
        style={{
          position: "absolute",
          ...(portrait ? { left: 90, top: 1030 } : { left: 860, top: 330 }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Slam at={3} size={portrait ? 190 : 210} from={1.25}>
            o-d.dev
          </Slam>
          <Arrow
            size={portrait ? 110 : 120}
            stroke={color.mint}
            style={{
              opacity: enter(f, 8),
              translate: `${(1 - enter(f, 8, 12)) * -60}px ${(1 - enter(f, 8, 12)) * 60}px`,
            }}
          />
        </div>
        <div
          style={{
            height: 8,
            width: line * (portrait ? 880 : 920),
            background: color.mint,
            marginTop: 26,
            borderRadius: 4,
          }}
        />
        <Rise at={18} style={{ fontSize: portrait ? 44 : 42, fontWeight: 600, letterSpacing: "-.01em", marginTop: 40 }}>
          {copy.services}
        </Rise>
        <Rise at={26} style={{ fontSize: portrait ? 28 : 26, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: color.muted, marginTop: 18 }}>
          O.D. Empower · Oleksandr Dzisiak
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

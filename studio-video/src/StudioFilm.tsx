import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import {
  Applications,
  Closing,
  Connections,
  Opening,
  Personal,
  Websites,
} from "./scenes";
import { clamp, color } from "./design";
import timing from "./timing.json";
import timingPl from "./timing-pl.json";
import { FilmLanguage, type FilmLocale } from "./i18n";
import "./style.css";

void loadFont({
  family: "StudioSans",
  url: staticFile("fonts/noto-sans-latin.woff2"),
  weight: "100 900",
  display: "block",
  unicodeRange:
    "U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
});
void loadFont({
  family: "StudioSans",
  url: staticFile("fonts/noto-sans-latin-ext.woff2"),
  weight: "100 900",
  display: "block",
  unicodeRange: "U+0100-024F,U+1E00-1EFF",
});

const scenes = [
  Opening,
  Websites,
  Applications,
  Connections,
  Personal,
  Closing,
];

const Transition = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const x = interpolate(frame, [0, 10, 24], [-125, 0, 125], { ...clamp });
  return (
    <AbsoluteFill style={{ perspective: 1800, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: "-10% -15%",
          background: index % 2 ? color.mint : "#d8edbc",
          transform: `translateX(${x}%) skewX(-10deg) rotateY(${interpolate(frame, [0, 24], [-9, 9])}deg)`,
          boxShadow: "0 0 100px #00000044",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            fontSize: Math.min(width, height) * 0.2,
            fontFamily: "StudioSans",
            fontWeight: 800,
            letterSpacing: "-.08em",
            color: "#0b151115",
            whiteSpace: "nowrap",
            rotate: "-8deg",
          }}
        >
          O.D. EMPOWER
        </div>
        <Img
          src={staticFile("brand/logo-dark.svg")}
          style={{
            width: Math.min(width, height) * 0.28,
            height: Math.min(width, height) * 0.34,
            rotate: `${interpolate(frame, [0, 24], [-25, 40])}deg`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const StudioFilm = ({ locale = "en" }: { locale?: FilmLocale }) => {
  const edit = locale === "pl" ? timingPl : timing;
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <FilmLanguage locale={locale}>
      <AbsoluteFill style={{ background: color.ink }}>
        <Audio
          src={staticFile(
            locale === "pl"
              ? "audio/pl/soundtrack.m4a"
              : "audio/soundtrack.m4a",
          )}
        />
        {edit.scenes.map((scene, index) => {
          const Scene = scenes[index];
          return (
            <Sequence
              key={scene.id}
              name={scene.headline}
              from={scene.from}
              durationInFrames={scene.duration}
              premountFor={15}
            >
              <Scene />
            </Sequence>
          );
        })}
        {edit.scenes.slice(1).map((scene, index) => (
          <Sequence
            key={scene.id}
            name="3D shutter transition"
            from={scene.from - 10}
            durationInFrames={24}
          >
            <Transition index={index} />
          </Sequence>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 5,
            width: (width * frame) / (edit.durationInFrames - 1),
            background: color.green,
          }}
        />
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [0, 6, edit.durationInFrames - 10, edit.durationInFrames - 1],
              [1, 0, 0, 1],
              clamp,
            ),
            background: color.ink,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </FilmLanguage>
  );
};

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import {
  Breakdown,
  Connected,
  Cta,
  Drop,
  Finale,
  Hook,
  Reel,
  type ReelShot,
} from "./scenes";
import { Grain, Vignette } from "./elements";
import { BEAT, clamp, color, noise, pulse, section } from "./design";
import edit from "./edit.json";
import { FilmLanguage, useFilmCopy, type FilmLocale } from "./i18n";
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

void loadFont({
  family: "StudioSans",
  url: staticFile("fonts/noto-sans-cyrillic.woff2"),
  weight: "100 900",
  display: "block",
  unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
});

// Two-beat cuts open each half of the reel, then it doubles to one cut per beat.
const websites: ReelShot[] = [
  { id: "feigin-electric", name: "Feigin Electric", beats: 2, mobile: true },
  { id: "liberty-immigration", name: "Liberty Immigration", beats: 2, mobile: true },
  { id: "love-notes", name: "Love Notes", beats: 1, mobile: true },
  { id: "plenum", name: "Plenum", beats: 1, mobile: true },
  { id: "solar-sense", name: "Solar Sense", beats: 1, mobile: true },
  { id: "club-smart-mam", name: "Club Smart Mam", beats: 1, mobile: true },
];
const apps: ReelShot[] = [
  { id: "work-buddy", name: "Work Buddy", beats: 2 },
  { id: "erm-system", name: "ERM System", beats: 2, mobile: true },
  { id: "tunerfest", name: "TunerFest", beats: 1, mobile: true },
  { id: "movie-browser", name: "Movie Browser", beats: 1, mobile: true },
  { id: "cusemit", name: "Cusemit", beats: 1 },
  { id: "gemini-bookmark-manager", name: "Bookmark Manager", beats: 1 },
];
const total = websites.length + apps.length;

const flashes = [
  { at: 112, strength: 0.9 },
  { at: 168, strength: 0.35 },
  { at: 280, strength: 0.35 },
  { at: 392, strength: 0.35 },
  { at: 560, strength: 0.9 },
  { at: 616, strength: 0.7 },
];
// The kick plays through both drops; the frame bumps with it.
const grooves = [
  [112, 448],
  [560, 672],
];

const Edit = () => {
  const copy = useFilmCopy();
  const scenes = {
    hook: <Hook />,
    drop: <Drop />,
    websites: <Reel label={copy.websites} shots={websites} offset={0} total={total} />,
    apps: <Reel label={copy.apps} shots={apps} offset={websites.length} total={total} />,
    connected: <Connected />,
    breakdown: <Breakdown />,
    finale: <Finale />,
    cta: <Cta />,
  };
  return (
    <>
      {edit.sections.map(({ id }) => {
        const { from, duration } = section(id);
        return (
          <Sequence key={id} name={id} from={from} durationInFrames={duration} premountFor={15}>
            {scenes[id as keyof typeof scenes]}
          </Sequence>
        );
      })}
    </>
  );
};

export const StudioFilm = ({ locale = "en" }: { locale?: FilmLocale }) => {
  const frame = useCurrentFrame();
  const shake = edit.impacts.reduce((sum, at) => {
    const age = frame - at;
    return age < 0 || age > 14 ? sum : sum + 18 * Math.exp(-age / 3.2);
  }, 0);
  const groove = grooves.some(([a, b]) => frame >= a && frame < b);
  const punch = groove ? 1 + pulse(frame, 3) * 0.014 : 1;
  const flash = flashes.reduce((sum, { at, strength }) => {
    const age = frame - at;
    return age < 0 || age > 6 ? sum : Math.max(sum, strength * Math.exp(-age / 1.6));
  }, 0);
  return (
    <FilmLanguage locale={locale}>
      <AbsoluteFill style={{ background: color.ink }}>
        <Audio src={staticFile("audio/soundtrack.m4a")} />
        <AbsoluteFill
          style={{
            translate: `${(noise(frame) - 0.5) * shake}px ${(noise(frame + 99) - 0.5) * shake}px`,
            rotate: `${(noise(frame + 7) - 0.5) * shake * 0.03}deg`,
            scale: punch + shake * 0.002,
          }}
        >
          <Edit />
        </AbsoluteFill>
        <Vignette />
        <Grain />
        <AbsoluteFill style={{ background: color.paper, opacity: flash, pointerEvents: "none" }} />
        <AbsoluteFill
          style={{
            background: "#000",
            opacity: interpolate(
              frame,
              [edit.durationInFrames - BEAT, edit.durationInFrames - 1],
              [0, 1],
              clamp,
            ),
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </FilmLanguage>
  );
};

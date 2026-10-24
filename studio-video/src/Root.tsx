import { Composition } from "remotion";
import { StudioFilm } from "./StudioFilm";
import edit from "./edit.json";

const formats = [
  ["Wide", 1920, 1080],
  ["Vertical", 1080, 1920],
] as const;
export const RemotionRoot = () => (
  <>
    {(["en", "pl"] as const).map((locale) =>
      formats.map(([name, width, height]) => (
        <Composition
          key={locale + name}
          id={`Studio${name}${locale === "pl" ? "PL" : ""}`}
          component={StudioFilm}
          defaultProps={{ locale }}
          width={width}
          height={height}
          fps={edit.fps}
          durationInFrames={edit.durationInFrames}
        />
      )),
    )}
  </>
);

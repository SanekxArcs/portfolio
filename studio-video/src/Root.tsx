import { Composition, Freeze, Still } from "remotion";
import { StudioFilm } from "./StudioFilm";
import { Closing } from "./scenes";
import timing from "./timing.json";
import timingPl from "./timing-pl.json";
import { FilmLanguage } from "./i18n";

export const RemotionRoot = () => (
  <>
    <Composition
      id="StudioWide"
      component={StudioFilm}
      width={1920}
      height={1080}
      fps={timing.fps}
      durationInFrames={timing.durationInFrames}
    />
    <Composition
      id="StudioVertical"
      component={StudioFilm}
      width={1080}
      height={1920}
      fps={timing.fps}
      durationInFrames={timing.durationInFrames}
    />
    <Still
      id="StudioPoster"
      component={() => (
        <Freeze frame={110}>
          <Closing />
        </Freeze>
      )}
      width={1920}
      height={1080}
    />
    <Composition
      id="StudioWidePL"
      component={StudioFilm}
      defaultProps={{ locale: "pl" }}
      width={1920}
      height={1080}
      fps={timingPl.fps}
      durationInFrames={timingPl.durationInFrames}
    />
    <Composition
      id="StudioVerticalPL"
      component={StudioFilm}
      defaultProps={{ locale: "pl" }}
      width={1080}
      height={1920}
      fps={timingPl.fps}
      durationInFrames={timingPl.durationInFrames}
    />
    <Still
      id="StudioPosterPL"
      component={() => (
        <FilmLanguage locale="pl">
          <Freeze frame={110}>
            <Closing />
          </Freeze>
        </FilmLanguage>
      )}
      width={1920}
      height={1080}
    />
  </>
);

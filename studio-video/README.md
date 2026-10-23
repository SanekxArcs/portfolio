# O.D. EMPOWER — studio film

A studio promo in English (36 seconds) and Polish (38.5 seconds), built in Remotion and Three.js. Each language has separate horizontal and vertical layouts. The original O.D. logo, mint/ink colours, website font, portrait and real project captures connect it to the portfolio.

## Exports

The four current exports are collected in `out/delivery/`:

| Language | Horizontal, 1920 × 1080        | Vertical, 1080 × 1920        |
| -------- | ------------------------------ | ---------------------------- |
| English  | `od-empower-en-horizontal.mp4` | `od-empower-en-vertical.mp4` |
| Polish   | `od-empower-pl-horizontal.mp4` | `od-empower-pl-vertical.mp4` |

All are 30 fps, H.264 + AAC, with narration, music and effects. `out/od-empower-en-pl.zip` contains all four videos and optional SRT captions.

- `out/od-empower-wide-v3.mp4` and `out/od-empower-vertical-v3.mp4` — current narration and clearer mix; visuals are identical to the original exports
- `out/od-empower-voice-review.mp3` — name and closing lines without music or effects
- `out/od-empower-wide.mp4` — 1920 × 1080, 30 fps, H.264 + AAC
- `out/od-empower-vertical.mp4` — 1080 × 1920, 30 fps, H.264 + AAC
- `out/od-empower-poster.png` — widescreen cover
- `out/od-empower-en.srt` — optional narration captions
- `out/verification-en.json` and `out/verification-pl.json` — export dimensions, duration and full-decode results

The vertical version has its own layout. It is not a crop of the widescreen edit.

## Preview and render

Run these commands inside this folder:

```sh
npm ci
npm run studio
npm run render
```

The preview uses port 3002. Render one format with `npm run render:wide` or `npm run render:vertical`. `npm run stills` renders one review frame per scene and format. Set `CHROME_PATH` if Chrome is installed in a custom location; otherwise the renderer finds a local Playwright Chromium or uses Remotion's browser setup.

`npm run lint` checks the video source and TypeScript. `npm run verify` decodes both finished files and writes contact sheets from the actual MP4s.

For Polish, use `npm run render:pl`, `npm run stills:pl`, `npm run audio:pl` and `npm run verify:pl`. Remotion Studio includes `StudioWide`, `StudioVertical`, `StudioWidePL` and `StudioVerticalPL`. Polish uses the native `pl-PL-MarekNeural` voice, its own scene timing and a longer closing hold. Both fonts include Polish characters.

After verifying both languages, `npm run delivery` collects all four current videos and both caption files in `out/delivery/`.

## Edit the film

- `film.json`: narration, voice, minimum scene durations and music tempo
- `film-pl.json`: Polish narration, voice and minimum scene durations
- `src/i18n.tsx`: on-screen English and Polish wording
- `src/scenes.tsx`: scene layouts
- `src/BrandModel.tsx`: extruded original SVG, bevels, lights and moving orbit points
- `src/StudioFilm.tsx`: edit, shutter transitions and mixed soundtrack
- `src/timing.json`: generated scene boundaries, rounded to the half-second beat
- `src/timing-pl.json`: independently generated Polish scene boundaries
- `scripts/generate-soundtrack.py`: original score, transition effects and narration mix

All animation is driven by the video frame. There are no real-time clocks, CSS animations or independent Three.js loops.

To change the narration, install Python dependencies and make sure FFmpeg is available:

```sh
python -m pip install -r requirements.txt
python scripts/generate-voice.py --force
python scripts/generate-soundtrack.py
npm run render
```

The selected neural voice is `en-US-AndrewMultilingualNeural`, with a slightly slower delivery. Voice generation needs an internet connection. The generated voice files are included, so previewing and rendering need no speech account or API key.

The personal introduction says **“I'm your developer. We'll work together, from the first sketch to launch.”** The on-screen name remains **Oleksandr Dzisiak**. `speechParts` in `film.json` controls spoken wording, individual phrase rates and pauses separately from the written captions. The brand's speech input is “Oh Dee Empower” to prevent the synthesizer from misreading the initials.

For sound-only edits, regenerate selected lines while keeping the edit boundaries, rebuild the mix, and replace the audio tracks:

```sh
python scripts/generate-voice.py --force --only personal,closing --keep-edit
python scripts/generate-soundtrack.py
npm run audio:replace -- v3
npm run verify
```

The replacement checks that the compressed video data is unchanged. Music and effects duck during speech, and the sonic sign-off begins only after the closing words finish.

## Storyboard

| Time      | Picture                                                              | Message                        |
| --------- | -------------------------------------------------------------------- | ------------------------------ |
| 0–6 s     | Rotating beveled logo, orbit particles, masked type swap             | Need a website? A web app?     |
| 6–11.5 s  | Moving desktop and mobile frames for Solar Sense and Feigin Electric | A clear first impression       |
| 11.5–17 s | ERM transitions into Work Buddy                                      | Built around your work         |
| 17–22.5 s | Connected store, data and team; moving data pulses                   | Less busywork                  |
| 22.5–29 s | Portrait enters as a dimensional card                                | One developer. Direct contact. |
| 29–36 s   | Logo returns, address draws on, ending holds                         | Tell me what you're building   |

## Assets and sound

The music and sound effects are synthesized from scratch by the included script, with a beat aligned to the scene timing. The revised export was measured at approximately −15.8 LUFS with a −2.3 dB true peak.

Project screenshots and portrait come from the existing portfolio. No confidential client assets are used. The logo is the actual supplied SVG, extruded into a Three.js mesh. Noto Sans is distributed under the included SIL Open Font License.

The assets are already local in `public/`. `npm run assets` is an optional refresh from the parent portfolio checkout.

## Website isolation

This folder has its own package manifest and lockfile. The parent Next.js TypeScript and lint configurations exclude it, and `.vercelignore` omits it from website deployments. Rendered files in `out/` and dependencies in `node_modules/` are ignored by Git.

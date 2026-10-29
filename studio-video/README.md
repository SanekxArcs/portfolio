# O.D. EMPOWER — studio film

A 24-second beat-cut promo, built in Remotion and Three.js, in English, Polish and Ukrainian, each with its own horizontal and vertical layout. There is no narration: big type, hard cuts and an original synthesized score carry it, so it works with the sound off too.

## Exports

`npm run delivery` collects the current cuts in `out/delivery/`:

| Language | Horizontal, 1920 × 1080        | Vertical, 1080 × 1920        |
| -------- | ------------------------------ | ---------------------------- |
| English  | `od-empower-en-horizontal.mp4` | `od-empower-en-vertical.mp4` |
| Polish   | `od-empower-pl-horizontal.mp4` | `od-empower-pl-vertical.mp4` |
| Ukrainian | `od-empower-ua-horizontal.mp4` | `od-empower-ua-vertical.mp4` |

All are 30 fps, H.264 + AAC. The vertical version has its own layout. It is not a crop of the widescreen edit.

## Preview and render

Run these commands inside this folder:

```sh
npm ci
npm run studio
npm run render        # English, both formats
npm run render:pl     # Polish, both formats
npm run render:ua     # Ukrainian, both formats
```

The preview uses port 3002, and renders use port 3079 (override with `REMOTION_PORT`) so they don't collide with the website's dev server. `npm run stills` / `stills:pl` / `stills:ua` render one review frame per section. `npm run verify` / `verify:pl` / `verify:ua` fully decode the finished files and write contact sheets from the actual MP4s. Set `CHROME_PATH` if Chrome is in a custom location.

## How it's built

Everything runs on one grid: **128.6 BPM, so one beat is exactly 14 frames at 30 fps**. `src/edit.json` holds the section boundaries and impact frames. The scenes and the score both read it, so picture and sound can't drift apart.

| Beats | Section   | Picture                                                                         |
| ----- | --------- | ------------------------------------------------------------------------------- |
| 0–7   | hook      | "Got / an / idea?" lands word by word, flips to mint, then rushes into the lens |
| 8–11  | drop      | Flash; the 3D logo whips in over moving outlined marquee type                   |
| 12–19 | websites  | Six real sites: two-beat cuts, then one per beat                                |
| 20–27 | apps      | Six real apps, same acceleration                                                |
| 28–31 | connected | APIs / Automation / AI tools build a node graph; "All connected." on mint       |
| 32–39 | breakdown | Music drops out; portrait mask reveal, "One developer. Direct contact."         |
| 40–43 | finale    | "Let's / build / it." strobing across three palettes, then a recap strobe       |
| 44–51 | cta       | Logo, o-d.dev, services; hold and fade                                          |

- `src/edit.json`: the beat grid, sections and impact frames
- `src/i18n.tsx`: all on-screen English, Polish and Ukrainian wording
- `src/scenes.tsx`: one component per section
- `src/StudioFilm.tsx`: edit order, reel project list, camera shake, kick punch, flash frames, grain
- `src/BrandModel.tsx`: the original SVG logo extruded in Three.js
- `scripts/generate-soundtrack.py`: the score

All animation is driven by the video frame, including grain and shake, which use seeded noise. Every render is identical.

## Sound

`npm run audio` (needs `numpy` from `requirements.txt` and FFmpeg) synthesizes the whole track from scratch, with no samples. It has a four-on-the-floor kick, clap, hats, a rolling offbeat bass and supersaw stabs, all ducked by the kick, over a D minor i–VI–III–VII loop. It also builds risers, snare rolls, impacts on each section hit and a stutter gate under the recap strobe. The output is mastered to about −14 LUFS. All languages share one soundtrack, because they share one edit.

## Assets

The project captures in `public/reel/`, the portrait, the logo and the Noto Sans font come from the portfolio. The bundled Cyrillic Noto Sans subset comes from Google Fonts (Noto Sans v42) under the same SIL Open Font License. `npm run assets` refreshes them from the parent checkout. Noto Sans is distributed under the included SIL Open Font License.

## Website isolation

This folder has its own package manifest and lockfile. The parent Next.js TypeScript and lint configurations exclude it, and `.vercelignore` omits it from website deployments. Rendered files in `out/` and dependencies in `node_modules/` are ignored by Git.

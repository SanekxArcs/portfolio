# Transition research and implementation

Reviewed 19 October 2026, against the supplied recording and the installed Next 16.2.10 / React 19.2.7 / Motion 12.23.26 application.

## Findings from the recording

The earlier implementation hid the outgoing page before the next route was ready. It also split text into animated words, replayed reveals during scrolling, and restarted numbers from zero. Nested page/word/height animation systems competed. A passing build and the presence of animations did not establish visual continuity.

## Primary sources and choices

| Approach                                                                                              | Findings                                                                                                                                                                                 | Decision                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [React ViewTransition](https://react.dev/reference/react/ViewTransition)                              | Coordinates snapshots with concurrent React commits, Suspense, layout effects, fonts and images. Supports shared identities and transition types. React should own the browser API call. | Use React for route and language changes. A separate synchronous theme update uses one viewport-wide native snapshot; the coordinator prevents it from overlapping route snapshots. |
| [Next viewTransition](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) | Next provides an experimental integration. Its bundled React implementation exposes the API even though standalone installed React 19.2 does not.                                        | Opt in on the existing local branch; do not imply this is a stable production API.                                                                                                  |
| [Motion layout animations](https://motion.dev/docs/react-layout-animations)                           | Interruptible layout and presence animations suit controls and lists. Scaling large text surfaces can introduce distortion.                                                              | Retain Motion for local filters, tabs, disclosures, mobile navigation and form changes. Remove imperative page transforms and scroll-triggered text reveals.                        |
| [Motion AnimateView](https://motion.dev/docs/react-animate-view)                                      | The documented wrapper requires React 19.3 or later and a separate entry point.                                                                                                          | Do not use that wrapper with this app's standalone React 19.2 package or upgrade the entire stack just for it.                                                                      |
| [NumberFlow](https://number-flow.barvian.me/)                                                         | Animates changes between real numeric values, supports formatting and reduced motion.                                                                                                    | Install @number-flow/react for changing counts. No zero-to-value animation on mount or scroll.                                                                                      |
| [Torph TextMorph](https://github.com/lochie/torph)                                                    | Character/word layout morphing is useful for short changing strings.                                                                                                                     | Researched; not added. Long translated paragraphs reflow substantially. Native text snapshots preserve normal line breaking without generating hundreds of animated letters.        |
| [React Text Transition](https://github.com/WinterCore/react-text-transition)                          | Spring-based short string transitions.                                                                                                                                                   | Researched; not added. Another animation runtime is unnecessary for this implementation.                                                                                            |

## Implemented behavior

- Internal studio links retain normal Next link semantics, modifier-click behavior and prefetching. Navigation starts immediately inside a React transition; there is no outgoing animation delay.
- Page navigation uses one complete studio-shell snapshot, including the 3D canvas. Pages and language changes reveal as a 680 ms circle from the actual link click; keyboard activation starts at the link center. The old snapshot retains its original scroll offset while the destination renders at its normal position. A shallow perspective tilt and depth change accompany the wave, pivoting around the activation point. Touch uses a smaller tilt. Locale geometry is carried across root-layout changes, and language navigation preserves scroll.
- Language changes now use the same complete-surface wave as page navigation. The existing text snapshot components remain available for local copy changes.
- Language navigation preserves the current route, query, hash and scroll position, with the existing locale cookie and volatile enquiry draft handling.
- Starting a transition stops any in-flight smooth scroll at its current position, preventing sticky-header drift between snapshots.
- Dark/light changes expand in a 620 ms circular wave from the theme button, in either direction. The coordinator uses a synchronous theme commit and a viewport-wide native snapshot so the background and 3D canvas participate together. A new route or theme action cancels the preceding wave. Reduced motion and unsupported browsers switch directly. The HTML class is applied in a layout effect before the snapshot; next-themes persists the preference. See [MDN circular reveal example](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#A_JavaScript-powered_custom_same-document_SPA_transition).
- Page and language reveals use the 680 ms circular wave and restrained perspective motion. Local text transitions use 320 ms easing. NumberFlow uses 380 ms digit motion. There are no staggered full-page word reveals.
- The form/draft presence swap uses overlapping views instead of a sequential empty interval. Local controls continue to use Motion.
- System and user reduced-motion preferences bypass the snapshot movement and numeric animation. Browsers without the View Transition API still navigate and render translated content.

## Limits

Next's integration remains experimental. Browser support and back/forward transition behavior differ; ordinary history navigation must continue to work even where the browser skips animation. This does not promise identical animation in every browser. Three.js continues animating the logo between transitions; the complete surface, including that canvas, participates in page snapshots.

next-themes emits React's inline-script insertion warning during development locale navigation. The theme bootstrap is server-rendered on initial load, and the provider's effect applies later theme changes. No browser exceptions or console errors were observed in the tested production flows.

## Verification

Production build (including TypeScript), focused ESLint checks on the changed animation components, and all six existing content/localization tests pass. Browser checks on the production preview cover actual native snapshot animations, same-document EN/PL/UA navigation, preserved scroll at 750px, rapid switching, theme persistence after reload, animated NumberFlow values, mobile reduced motion without horizontal overflow, browser history, enquiry fields preserved across language changes and form/draft/back transitions, and successful navigation with document.startViewTransition unavailable. Mid-transition frames were visually inspected. That inspection caught sticky-header drift during an in-flight smooth scroll; freezing the scroll at transition start fixed the captured header position. These checks supplement visual review; they do not replace a check of animation feel on the user's actual device.

Theme wave verification: visible clip-path animation was inspected in a captured intermediate frame. Both directions, rapid repeated clicks, route interruption and mobile reduced motion passed without page errors.

Click-origin page waves: scrolled-page navigation and the homepage logo were visually checked in intermediate/settled frames. Language changes use the same wave and depth effect while retaining scroll.

The 3D logo remains rendered by Three.js and participates in the complete-surface snapshot. Page depth uses compositor perspective transforms on browser snapshots, rather than a second WebGL renderer or re-rendering accessible page text as textures. The perspective resolves to the exact natural layout; reduced motion bypasses it.

Language/depth verification: production snapshots show a real matrix3d perspective transform and a circle centered at the selected language link. EN/PL/UA switches retain scroll at 750px, return to an untransformed layout, and clear temporary geometry. Keyboard-origin navigation, mobile language switching, browser history, reduced motion and the unsupported-API fallback passed without page exceptions. Production build, focused lint and six content/localization tests pass.

## Logo renderer regression after locale changes

The mobile recording and desktop reproduction exposed a missed lifecycle check: the logo component survives a language switch, but its portal host is replaced. The renderer effect previously depended only on hydration and reduced-motion settings, so it kept the removed host and the new host showed only the unpositioned fallback. Browser checks had verified page transitions without checking live WebGL rendering after locale changes.

The renderer now binds to the actual host node through a callback ref, disposes the old scene when that node changes, and initializes the new host. Fallback positioning happens in a layout effect before paint. The animation clock survives host changes, and a ResizeObserver updates layout after translated hero dimensions change, including in reduced-motion mode.

Regression checks measure real WebGL draw calls, require one connected canvas, compare logo coordinates with its interactive anchor, and toggle the photo in both directions after repeated EN/PL/UA navigation at mobile and desktop widths.

## Home navigation and stable header

The 19 October Home recording showed a same-route logo click while scrolled down the homepage. Same-path, same-query links without a fragment now prevent a redundant Next navigation and explicitly scroll to the top (instant with reduced motion). Existing fragments are cleared without replacing Next's history state. Hash destinations retain their normal link behavior.

The header and keyboard skip link now sit outside the `studio-shell` page-depth boundary, inside the transition coordinator. The header has a separate stable chrome class for route updates. Main content and the hero canvas continue to participate in the page reveal; the theme wave still captures the complete viewport.

Production browser checks at 390px and 1440px sampled same-page Home scrolling: no view transition, no header displacement, and no change in the selected-work heading's document position. Scrolled Experience-to-Home and Contact-to-Home navigation were checked, including captured intermediate frames. Additional checks covered hash cleanup, browser Back, skip-link order, reduced motion, language/theme switching, real hero WebGL draw calls after locale changes, logo-anchor alignment, and photo toggling.

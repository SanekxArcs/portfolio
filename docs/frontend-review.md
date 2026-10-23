# Frontend implementation review

Branch: `local/two-path-portfolio`. Local design phase; no deployment or database project created.

## Implemented

- One studio homepage with project and recruiter paths, the existing interactive 3D logo/photo, selected work, services, process and personal introduction.
- Dedicated services, filterable work gallery, 26 individual project pages, full experience/CV and project/hiring contact pages in English, Polish and Ukrainian.
- Locale URLs `/en`, `/pl`, `/uk`, route-preserving language links, an explicit language preference cookie and compatibility with the previous portfolio's main section links.
- Localized metadata, canonical/hreflang links, social-image route, 93 public sitemap URLs and defined-locale/project routing.
- Responsive layouts, light/dark themes, keyboard navigation, touch photo reveal and system/user reduced-motion support.
- Public source content retained, including 12 visible jobs, earlier-role expansion, all strengths, skills, education, courses, interests and projects. Original course/product/company names remain unchanged; CV language is labelled English.
- Icon-only email/phone actions. Social labels exclude personal notes/contact data from the original source descriptions.
- A validated enquiry composer with project/hiring modes, service preselection, an email draft, copy fallback and an explicit explanation that the site does not submit/store enquiries.

## Verification

- Production build succeeds for all localized routes; TypeScript succeeds.
- Seven content/localization/media tests pass: bundled asset references, NDA redaction, public-data boundaries, full UI-key coverage, project/career translation coverage and stable unique route mapping.
- Production browser layout checks pass across all three languages, representative page types, both themes, and 320/390/768/1024/1440px widths. No horizontal overflow or broken loaded images observed.
- Browser checks cover commercial/independent/NDA filters, all 78 project URLs, English CV download, complete work history and earlier-role expansion, enquiry validation/draft/back flow, hiring-mode persistence through a language change, language preference, project deep links and legacy root hashes.
- Touch/reduced-motion logo toggling and mobile menu/Escape behavior pass.
- Unknown locale and unknown project URLs return 404. Sitemap has 93 URLs.
- No browser page errors or Sanity requests observed in the tested production flows.

## Design review boundary

Convex, authenticated `/admin`, live publishing, durable enquiry submission and restored AI chat remain deferred until the visual/content structure is reviewed. The local translations are complete first-pass copy and can be refined alongside the design. Original English source content remains in `content/profile.json` and full Sanity/source backups remain private in the ignored backup folder.

Edit the studio content through `content/site/`, project routing/featured flags through `content/project-index.json`, and data access through `lib/studio-content.ts`. The UI is separated from its future database adapter.

## Motion refinement - replaced after recording review

The earlier outgoing fade, word-by-word scroll reveals and zero-based count animations made combined interactions feel discontinuous. They have been replaced with React-coordinated View Transitions. Routes retain the outgoing page while Next prepares the incoming view. Language changes reveal the translated surface from the chosen language link while retaining scroll. Page navigation reveals the full studio surface from the clicked link, preserving the outgoing scroll position; language changes use the same wave, with a shallow perspective tilt for both. Theme changes capture the class during a synchronous React commit and reveal the complete viewport with a circular wave from the toggle.

Motion remains responsible for local controls: filters, disclosures, mobile navigation, form states and container sizing. Form/draft views overlap during the swap instead of waiting through an empty state. NumberFlow transitions existing numeric values and does not restart counters on scroll. Ordinary scrolling never hides text.

See [transition research](transition-research.md) for primary sources, library decisions, timing, compatibility and verification. This branch enables Next's experimental React View Transition integration; it is still a local design preview.

## Project media refresh

The public project sites were reviewed and 39 current desktop/mobile/detail captures added across 15 projects. Responsive browser/phone compositions now appear in featured work, the gallery and case-study covers. Decorative return arrows were replaced by restrained dot markers. Original source images remain intact; see [capture provenance and retained-image notes](project-imagery.md).

## Main sculpture arrival and studio identity

The single main logo canvas persists from the hero/background to the final CTA (or a reserved footer area on pages without a CTA). Its measured scroll path begins only once the final surface enters the viewport. The logo first shrinks behind content, passes through the outside gutter and curves into a reserved foreground dock; the entire orbit envelope must clear the content edge before its layer is raised. Reversing scroll reverses the journey. The final CTA sculpture is now deliberately large, with separate desktop/tablet/mobile spacing; waves retain their own clipping layer. Reduced motion uses static background/dock poses.

Header and footer wordmarks retain the logo with `.dev`. O.D. EMPOWER is the studio name in the footer copyright, localized studio copy, enquiry subjects, metadata and application manifest. The site address and personal CV identity remain unchanged.

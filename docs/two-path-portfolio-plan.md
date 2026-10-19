# O-D.DEV — two-audience website plan

Status: local-content migration and the frontend design implementation are complete. EN/PL/UK routes, client/recruiter journeys and local translations are implemented. Convex and the custom admin remain the next phase after visual review.
Branch: `local/two-path-portfolio`. Existing uncommitted improvements were carried forward. Nothing has been committed or deployed.

## 1. Positioning

One brand, two reasons to work together. Keep O-D.DEV, Oleksandr Dzisiak, the existing logo, emerald accent, light/dark themes and interactive logo/photo identity. Present an independent development studio led by Oleksandr. Use first-person language until a real team exists; do not imply extra staff, customers, testimonials or unverified results.

Use one shared homepage with two clear paths, rather than two heroes, a blocking audience selector, or a long CV with service cards appended. Both paths remain accessible from navigation at all times.

Suggested starting copy for design, subject to refinement:
- Eyebrow: O-D.DEV / Independent development studio
- Heading: Thoughtful websites. Practical web products.
- Supporting text: I'm Oleksandr, a full-stack developer building websites, applications and integrations for businesses — and bringing that experience to ambitious teams.
- Primary action: Start a project.
- Secondary action: Explore my experience.

## 2. Information architecture

| Route | Audience and purpose | Main next step |
| --- | --- | --- |
| `/` | Redirect to `/en`, respecting explicit language choices | Shared introduction |
| `/[locale]` | Shared homepage: positioning, strongest work, concise offers and personal introduction | Start a project / Explore my experience |
| `/[locale]/services` | Clients: outcomes, deliverables, process, questions and pricing enquiry | Discuss my project |
| `/[locale]/work` | Real commercial work and clearly labelled independent products | View a case study |
| `/[locale]/work/[slug]` | Project challenge, contribution, solution, evidence and links | Request a similar solution |
| `/[locale]/experience` | Recruiters: full profile, work history, skills, education and CV | Download CV / Contact about a role |
| `/[locale]/contact` | Project or hiring enquiry, with direct contact options | Compose enquiry |
| `/admin` | Later: authenticated content and translation editing | Edit and publish |

Languages: English, Polish and Ukrainian. Locale codes: `en`, `pl`, `uk`; visible labels: EN / PL / UA. Use `uk` in URLs, HTML language and SEO metadata. Keep slugs stable across languages initially.

Keep the current homepage working during implementation. Map existing incoming hash links such as `/#experience` and `/#projects` to the corresponding new destination when routes are ready. The old Sanity `/studio` route is retired; `/admin` is reserved for the future editor.

## 3. Shared homepage

1. Compact header: logo, Work, Services, Experience, Contact, language and theme controls. Mobile retains all destinations and a contact action.
2. One spacious hero explaining both offers, with the two actions above. Continue the interactive logo/photo and subtle orbits; text and links work before the scene loads.
3. Selected work: three visually strong examples with real screenshots and context. Evaluate Solar Sense, Feigin Electric and TunerFest against the available evidence/assets before choosing. Current CV pinned flags do not automatically select homepage case studies.
4. What I can build: short, business-oriented service preview linked to the detailed client path.
5. How collaboration works: discovery, scope/estimate, implementation, launch and support. Treat new commitments as draft copy until confirmed.
6. Short personal introduction explaining who delivers the work, linked to the full experience path. Keep the full biography and employment timeline on that path.
7. Clear pricing enquiry CTA, plus access to the hiring contact flow.
8. Compact footer with route links and icon-only email, phone and social contact options.

Visual direction: evolve the emerald identity into an editorial studio layout with stronger typography, real project imagery, more breathing room, varied section compositions and fewer nested bordered boxes. Preserve both themes and readable contrast. Each section should add new information, not repeat the hero pitch.

## 4. Client path

Lead with business needs, real work and a clear way to ask for an estimate. Employment history and exhaustive technology lists should not be the main sales story.

Proposed services to refine with the user:
- Business websites and landing pages.
- Web applications and internal tools.
- APIs, integrations and workflow automation.
- Improvements to existing products: interfaces, performance and maintainability.

For each service describe the problem addressed, typical deliverables and what requires custom scoping. Do not invent prices, guarantees, delivery times or support packages. AI workflows may sit within integrations rather than an unsupported universal offer.

Case studies should distinguish commercial work from experiments and personal products. Show context, personal responsibility, solution, technologies and substantiated outcomes. Respect NDA flags. An employer's customers must not become a fictitious studio client list. Missing metrics/testimonials remain editorial gaps.

CTA wording: “Tell me about your project” / “Ask for an estimate”. Include name, email, project type and a short brief; optional budget/timeline can include “Not sure yet”. Offer a hiring enquiry separately. Keep email and phone as accessible icon-only buttons.

During design, use an honest email-composer flow with a prepared brief. Never claim a message was sent or saved without a real backend acknowledgement. Durable submissions and delivery/status handling come with the backend phase.

## 5. Recruiter path

Retain all current public content: biography, full work history including earlier non-development jobs, technical skills, all strengths, education, courses, interests, languages, location, relocation preference, availability, contract preferences, projects, CV and social/contact links. Existing hidden-work and NDA rules stay intact.

Prioritize current role, relevant engineering experience and CV access. Earlier roles may become a clearly labelled expandable group without deleting them. Keep technical project depth available, with concise summaries visible first. The main contact action relates to hiring. Preserve logo/photo interaction and reduced-motion behavior.

## 6. Motion and responsive design

Continue the existing Three.js logo rather than replacing the brand. Keep subtle orbital motion and traveling points; on scroll it moves behind content, becomes darker and slightly blurred. Maintain a bounded render budget, pointer-safe layering, static fallback and pause behavior for hidden tabs.

Use motion to support the story: restrained section reveals, interactive project images and responsive button feedback. No forced intro playback, duplicate heroes, scroll hijacking or animations competing with text. Remotion is optional later for an actual pre-rendered showreel, not required for interactive website motion.

Review at 320–390px mobile, tablet and desktop. Include both themes, keyboard/focus states, touch interactions, reduced motion, readable Polish/Ukrainian text and zero horizontal overflow.

## 7. Local content and localization

Current source: `content/profile.json`, read through `lib/content.ts`. Public assets live in `public/content/`; `public/logo.svg` remains the scene's brand source. Components do not import a database SDK. Keep this adapter boundary when Convex arrives.

As the design is built, introduce a typed, structured local model for:
- Brand and personal identity: shared names, contacts, social links, logo/photo.
- Homepage: introduction, featured project IDs and CTA copy.
- Services: stable IDs, order and localized descriptions/deliverables.
- Projects: stable IDs/slugs, commercial/personal classification, visibility/NDA, assets, technologies, contribution, localized case-study text and featured placements.
- Experience/profile: employers, dates/order, relevant/earlier grouping, biography, skills, strengths, education, courses, languages, CV and practical hiring details.
- Navigation/UI/contact/SEO: all labels, form prompts, validation/errors, metadata and image descriptions.

Share non-translatable facts: IDs, URLs, dates, technology names and asset references. Store text by locale; do not duplicate three independent profiles or scatter language conditionals across components. English is the source language. Track missing Polish/Ukrainian translations; use an intentional English development fallback and block publication of incomplete localized pages.

Translate whole experiences, including buttons, validation, navigation, errors and SEO. Do not automatically translate company/personal names. Offer localized CV files only when the actual translated PDFs exist. Language switching preserves the current route/project where available and respects explicit visitor choice.

Add locale-specific titles/descriptions, HTML language, canonical URLs, hreflang including x-default, sitemap entries and shared social images. Establish routing/dictionaries with the first design phase; complete translations and full-language QA before calling the language rollout finished.

## 8. Convex and custom admin — after design

No Convex project, deployment or admin implementation is part of the current foundation. The backend primitives do not supply our complete content workflow automatically.

Proposed entities: site settings, pages, services, projects, experience, education, courses, assets and localized content linked by stable IDs. Include draft/published state, ordering, update timestamps and revision history. Choose final tables/validators after the page/content structure is settled.

The protected `/admin` should provide:
- Overview of drafts and missing EN/PL/UA translations.
- Page/service/project/profile/CV editors, ordering and visibility controls.
- Language tabs or side-by-side editing with source-language reference and required-field validation.
- Media library, image alt text and CV uploads through Convex file storage.
- Draft preview, explicit publication, revision history and restore/export tools.
- Owner authentication and server-side authorization on every protected query/mutation/upload. Public reads return published, explicitly public fields only.

Keep enquiries and any chat history separate from public content. Restore the AI assistant only after porting durable sessions, rate/budget limits, concurrency protection and replay protection. The old implementation and tests are archived; do not replace these protections with browser-only or per-process limits. Add abuse protection, real delivery status, retention and appropriate privacy copy before collecting project enquiries.

Migration sequence: seed from finalized local data with stable IDs, upload/map assets, verify every section and translation, switch the content adapter, test publication/preview and remove temporary local fallback only after parity. Raw private archive records need a separate authorized migration, never an indiscriminate public import.

## 9. Execution and completion criteria

| Phase | Deliverable | Completion condition |
| --- | --- | --- |
| 0. Preserve/disconnect | Branch, raw data/source/assets backup, local public content and retired Sanity runtime | Existing site works without Sanity credentials or requests; content matches snapshot |
| 1. Homepage/foundation | Shared navigation/footer, locale structure, visual system and one dual-purpose homepage | Both audiences understand the offer and reach their path immediately, desktop and mobile |
| 2. Client experience | Services, work, case studies and enquiry composition | Every CTA has a useful destination; claims and work attribution are accurate |
| 3. Recruiter experience | Dedicated experience/CV path | All existing information, CV and contact access remain available |
| 4. Languages/polish | Complete EN/PL/UK experiences and metadata | No fake switches, missing strings, clipped translations or broken localized links |
| 5. Backend/editor | Convex adapter, import, authenticated admin, draft/publish flow | Owner can edit supported content/translations without code; private data stays protected |

Review the homepage composition first, then the two detailed paths, before backend work. Phase 4 finishes localization; it does not retrofit routing into a completed monolingual site.

Foundation verification: compare all normalized local fields with the published snapshot; verify raw asset checksums and public copies; retain NDA masking; check logo/photo and CV download; block Sanity hosts in browser QA; run type checking and production build with Sanity settings absent.

Finished-design verification: inspect both themes/all languages/mobile-tablet-desktop; exercise keyboard, touch, reduced motion, deep links, language switching, navigation, contact flow, CV, image loading and representative browser errors. Static checks alone do not prove the live UI.

## Sources checked

Sanity supports translation; moving is a preference for a custom backend/editor workflow rather than a language limitation: https://www.sanity.io/docs/studio/localization

Convex backend/frontend deployment: https://docs.convex.dev/production/hosting
Authentication: https://docs.convex.dev/auth/overview
Files: https://docs.convex.dev/file-storage/overview

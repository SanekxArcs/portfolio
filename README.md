# O-D.DEV portfolio

A Next.js / React / TypeScript portfolio for Oleksandr Dzisiak. This branch prepares a two-audience site for potential clients and recruiters, in English, Polish and Ukrainian.

The redesigned frontend runs from local content. Convex and a custom content/translation admin are planned after the design is settled.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000/en (or /pl and /uk). The root remembers an explicitly selected language. No database credentials are required. Optional site URL and analytics settings are documented in `.env.local.example`.

## Content and assets

- `content/profile.json`: editable copy of the published portfolio content.
- `lib/content.ts`: shared content access boundary for page, navigation, footer and sitemap.
- `public/content/`: local copies of the assets used by the public portfolio.
- `public/logo.svg`: original O-D brand mark used by the interactive scene.

The UI preserves icon-only email and phone links, CV access, light/dark themes, the interactive logo/photo reveal, reduced-motion preferences, work history, projects and NDA visibility rules.

## Redesign and migration

- [Two-audience design and implementation plan](docs/two-path-portfolio-plan.md)
- [Sanity backup and recovery notes](docs/sanity-retirement.md)

The embedded Sanity Studio and CMS runtime have been retired. Full source/data backups remain locally in the ignored `.local-backups/` folder, separate from public content. The old AI assistant is paused until durable storage and its usage protections are restored.

## Checks

```sh
npm test
npx tsc --noEmit
npm run build
```

`npm run backup:sanity` is an optional read-only legacy export using server-side Sanity credentials. It does not modify the remote dataset and refuses to overwrite edited local profile content. It is not part of development or builds.

## Implemented frontend

One shared homepage leads to services, a filterable work gallery with 26 project pages per language, a dedicated experience/CV page, and a project/hiring enquiry composer. The form opens the visitor's email app and provides a copyable draft; it does not submit or store enquiries.

- `content/site/{en,pl,uk}.json`: translated UI, studio copy, services, process, FAQ, contact and metadata.
- `content/site/profile-{pl,uk}.json`: translated biography, work history, strengths and interests.
- `content/site/projects-{pl,uk}.json`: translated project descriptions/features.
- `content/project-index.json`: stable project slugs and featured flags, linked to the original snapshot.
- `lib/studio-content.ts`: localized local-data adapter to replace with Convex later.
- `components/studio/`: shared design and page components.

The original English `content/profile.json` remains unchanged. Company/product names, technologies and official course titles remain in their original language. Source course titles are explicitly labelled. The existing English CV file is not presented as a translated PDF.

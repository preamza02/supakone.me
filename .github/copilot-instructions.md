# Copilot Coding Agent Instructions for supakone.me

## Repository Overview

**supakone.me** is a personal portfolio website built with Astro v5+ and Starlight template. It includes a personal info page, blog system, and documentation for open source projects. Deployed via Cloudflare Pages (Static Site Generation).

**Important:** The actual application lives inside the `docs/` subdirectory. The root directory contains only git configuration, workflows, and the top-level README.

## Tech Stack

- **Framework:** Astro v5.6+ with Starlight v0.36+
- **Language:** TypeScript, MDX
- **Package Manager:** pnpm v10.19.0 (ALWAYS use pnpm, never npm or yarn)
- **Runtime:** Node.js v20
- **Deployment:** Cloudflare Pages
- **Testing:** Playwright v1.57+

## Critical Setup & Build Commands

**All commands must be run from the `docs/` directory:**

```bash
cd docs
```

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Install Playwright Browsers (REQUIRED for build)

The project uses `rehype-mermaid` which requires Playwright at build time. **Always install Playwright after `pnpm install`:**

```bash
pnpm exec playwright install --with-deps chromium
```

**CRITICAL:** Build will fail with "Executable doesn't exist at .../chromium_headless_shell" if Playwright browsers are not installed.

### 3. Build

```bash
pnpm run build
```

- Build time: ~10-15 seconds
- Output directory: `docs/dist/`

### 4. Type Checking

```bash
pnpm exec astro check
```

### 5. Run Tests

```bash
pnpm run test
```

- Runs Playwright E2E tests
- Requires build to be completed first (tests serve from `docs/dist/`)
- Test time: ~8-10 seconds

### 6. Code Formatting

```bash
pnpm run format
```

### 7. Development Server

```bash
pnpm dev
```

- Runs at `http://localhost:4321`

## Complete Validation Sequence

Always run this sequence to validate changes:

```bash
cd docs
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm exec astro check
pnpm run build
pnpm run test
```

## Project Structure

```
supakone.me/
├── .github/
│   ├── agents/           # Agent configuration (do not modify)
│   └── workflows/
│       ├── pr-test.yaml          # PR validation workflow
│       └── deploy-production.yaml # Production deployment
├── docs/                 # Main application directory
│   ├── src/
│   │   ├── assets/       # Images and SVG assets
│   │   ├── const/        # Constants (site title, URL)
│   │   ├── content/
│   │   │   └── docs/     # Content files (MDX/MD)
│   │   │       ├── blog/      # Blog posts
│   │   │       ├── docs/      # Documentation pages
│   │   │       └── info/      # Personal info pages
│   │   └── styles/       # Global CSS
│   ├── tests/            # Playwright E2E tests
│   ├── public/           # Static assets
│   ├── astro.config.mjs  # Astro configuration
│   ├── package.json      # Dependencies and scripts
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   └── wrangler.jsonc    # Cloudflare configuration
├── public/               # Root public assets (logo)
└── README.md
```

## Key Configuration Files

- `docs/astro.config.mjs` - Astro/Starlight configuration, plugins, social links
- `docs/src/content.config.ts` - Content collection schema
- `docs/src/const/const.ts` - Site constants (SITE_TITLE, URL)
- `docs/playwright.config.ts` - Test configuration
- `docs/wrangler.jsonc` - Cloudflare Pages configuration

## Content Guidelines (Starlight/MDX)

When creating new documentation pages, **always include** the standard Starlight frontmatter:

```yaml
---
title: [Title]
description: [Brief summary]
lastUpdated: YYYY-MM-DD
sidebar:
    order: [Number]
---
```

When editing docs files, update the `lastUpdated` field to the date of the change.

## CI/CD Workflows

### PR Workflow (`pr-test.yaml`)
Triggered on: PR opened, synchronized, reopened, ready for review

Steps: Checkout → Install pnpm → Setup Node 20 → Install deps → Install Playwright → Build → Run E2E tests

### Production Deployment (`deploy-production.yaml`)
Triggered on: Release published

Deploys to Cloudflare Pages using wrangler.

## Git Hooks

- **pre-commit:** Runs `pnpm run format` from docs/
- **pre-push:** Runs type checking (`astro check`) and build verification

## Known Issues & Workarounds

1. **Playwright browsers not installed:** If you see "Executable doesn't exist at /home/runner/.cache/ms-playwright/...", run `pnpm exec playwright install --with-deps chromium`

2. **Vite warnings about externalized node modules:** These warnings during build are expected and do not affect functionality

3. **`npm warn exec` during tests:** The test uses `npx serve` which may show a package installation warning - this is normal

## Trust These Instructions

These instructions have been validated. Only search for additional information if:
- The instructions appear incomplete for your specific task
- A command fails unexpectedly
- You need to modify a file not covered here

## Update Project Instructions, Roadmap and Documentation
If you made a modification that affect project structure, the way that the project is being documented or the way that the project is being build/tested/deployed please make sure to update this instruction file and other relevant documentation file such as `README.md` or other documentation page inside `docs/src/content/docs/` folder.
or If you finish task that related to roadmap please make sure to update the roadmap file inside `docs/src/content/docs/docs/roadmap.mdx` folder.
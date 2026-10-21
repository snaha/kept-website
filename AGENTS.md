# AGENTS.md

This file provides guidance to LLM AI agents like Claude Code, Gemini and OpenAI Codex when working with code in this repository.

## Quick Reference

See `README.md` for development commands, project structure, and deployment.

## Understanding the Codebase

**kept.music** is the static, fully prerendered landing page for Kept. It is a single page
(`src/routes/+page.svelte`) with an animated album-cover background and a newsletter signup.

### SvelteKit 3 specifics

- There is no `svelte.config.js`: SvelteKit options are passed to the `sveltekit(...)` plugin in
  `vite.config.ts`.
- `$lib` is gone: import from `#lib/...` (Node subpath imports, `imports` in `package.json`).
  Subpath imports follow Node semantics, so they need the full file name, including `.ts` and
  `/index.ts` for directories: `import { cn } from '#lib/utils.ts'`.
- `import.meta.glob` does not resolve `#lib`, so globs use relative paths.
- `tsconfig.json` extends `$app/tsconfig`.

## Important Patterns

1. **Type Safety**
   - TypeScript strict mode is enabled
   - **Never use `null`** - use `undefined` for optional/missing values. `null` is only allowed
     when it comes from external libraries or APIs (e.g. DOM methods)
   - **Never use `any`** - use proper types, generics, unions or `unknown` with type guards

2. **Design Fidelity**
   - The Figma design is the specification: same copy, order, spacing and sizes.
   - If implementation requires a deviation, surface it before shipping rather than papering over it.
   - Figma's code export drops its Noise effect: the grain is `src/lib/assets/grain.svg`, tuned
     against the Figma render.
   - Figma's `leading-[normal]` is CSS `line-height: normal`, not Tailwind's `leading-normal` (1.5).

3. **Assets (images, fonts, SVGs)**
   - Component-used assets live in `src/lib/assets/` and are imported as Vite modules
     (content-hashed file names, build-time missing-file errors, correct base path in PR previews)
   - ✅ `import logo from '#lib/assets/logo.svg'` then `<img src={logo} />`
   - ❌ Placing component-used files in `static/` and referencing them by absolute URL — that
     breaks under the `/pr-{num}` base path of PR previews
   - `static/` is reserved for files that need fixed URLs: favicons, `CNAME`

4. **External Links**
   - All outbound URLs live in `src/lib/external-links.ts`. Never hard-code them in components.

5. **UI Components (shadcn-svelte)**
   - UI components are in `src/lib/components/ui/` (configured by `components.json`)
   - Add new ones with `pnpm dlx shadcn-svelte@latest add <component>`
   - Use Tailwind CSS utility classes and `cn()` from `#lib/utils.ts` for class merging

6. **Motion**
   - Respect `prefers-reduced-motion`: the cover rows stop moving when it is set.

## Naming Conventions

- Use kebab-case for file and directory names (e.g. `album-grid.svelte`)
- Route-specific components stay in the route folder; reusable ones go to `src/lib/components/`

## Import Conventions

- Never use dynamic imports; always use static imports at the top of the file
- Relative imports omit `.js`/`.ts` extensions (enforced by ESLint); `#lib/...` imports always
  carry the full file name (see "SvelteKit 3 specifics")

## Testing

- Non-UI logic (anything Vitest can exercise without rendering, e.g. `src/lib/album-rows.ts`,
  `src/lib/newsletter.ts`) must have unit tests in `*.test.ts` next to the source
- Bug fixes: write a failing test first, then fix
- Run once with `pnpm test` (`pnpm test:unit` is watch mode)

## Commits & Pull Requests

- Use [conventional commits](https://www.conventionalcommits.org/) (e.g. `fix:`, `feat:`, `chore:`);
  release-please builds the changelog and releases from them
- Keep PR titles and descriptions concise
- When a PR resolves an issue, reference it with a closing keyword (e.g. `Closes #53`)

## Package Management

- Use `pnpm add -D [package]`; everything is bundled at build time, so all packages are dev
  dependencies

## Pre-commit Requirements

Before committing, run and pass `pnpm format`, then `pnpm check:all` (lint, type check, knip and
unit tests). CI (`.github/workflows/check.yaml`) runs the same checks as individual steps.

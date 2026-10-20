# kept.music

Landing page for [Kept](https://kept.music), a music library for the songs you own.

## Tech Stack

- **Framework**: SvelteKit 3 with Svelte 5 (runes), fully prerendered (`@sveltejs/adapter-static`)
- **UI**: shadcn-svelte components + Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Testing**: Vitest (unit)
- **Node**: >=22, **pnpm**: 11.x

## Quick Start

```bash
pnpm install
pnpm dev
```

## Development Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build the static site into build/
pnpm preview          # Preview the production build

pnpm check            # TypeScript and Svelte type checking
pnpm lint             # Prettier + ESLint
pnpm format           # Auto-format code
pnpm knip             # Unused files, dependencies and exports
pnpm test             # Run the unit tests once
pnpm test:unit        # Run unit tests in watch mode
pnpm check:all        # All of the above checks at once
```

## Project Structure

- `src/routes/+page.svelte` - The landing page
- `src/routes/album-grid.svelte` - Animated background of album covers (5 rows, alternating
  directions, shuffled on every visit, sized so five rows fill the viewport height)
- `src/routes/signup-form.svelte` - Launch newsletter signup
- `src/lib/album-rows.ts` - Shuffling and splitting covers into rows
- `src/lib/newsletter.ts` - Buttondown subscription
- `src/lib/assets/` - Covers, fonts and logo, imported through Vite (hashed file names)
- `static/` - Files that need fixed URLs: favicons, `CNAME`

### Album covers

Covers live in `src/lib/assets/covers/` as 384×384 WebP files (they are shown small, dimmed and
blurred). Every `.webp` in that folder is picked up automatically; the grid splits them evenly
over five rows, so keep the count a multiple of five (currently 60, 12 per row). To add covers:

```bash
cwebp -q 72 -resize 384 384 -metadata none input.webp -o src/lib/assets/covers/name.webp
```

## Newsletter

The signup form posts the email to Buttondown's embed endpoint for the `kept` newsletter
(`src/lib/external-links.ts`) without leaving the page. Buttondown then sends the visitor a
confirmation email. Without JavaScript the form falls back to a regular POST in a new tab.

## Deployments

- [`kept.music`](https://kept.music) - Production
- `kept.music/pr-{num}` - PR previews

Both production and PR previews are published to the `gh-pages` branch: `main` deploys to the root,
each open PR deploys to its own `pr-{num}/` subdirectory (removed when the PR closes). GitHub Pages
serves that branch at `kept.music`.

## Environment Variables

| Variable        | Default | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| `VITE_BASE_URL` |         | Base path for deployment (e.g. `/pr-12` CI) |

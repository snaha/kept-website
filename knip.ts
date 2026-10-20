import type { KnipConfig } from 'knip'

// `pnpm knip` runs this config twice: `knip && knip --production`.
// The trailing `!` marks production entries/files: the production pass starts
// only from the shipped app, so code reachable solely from its own tests is
// still reported. Do not add test globs to `entry`.
const config: KnipConfig = {
  entry: ['src/app.html!', 'src/routes/**/*!'],
  project: ['src/**/*!'],
  paths: {
    '$app/*': ['node_modules/@sveltejs/kit/src/runtime/app/*'],
    '$env/*': ['.svelte-kit/ambient.d.ts'],
  },
  // shadcn-svelte barrels re-export more than the site uses
  ignore: ['src/lib/components/ui/**/index.ts'],
  ignoreExportsUsedInFile: true,
}

export default config

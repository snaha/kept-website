import staticAdapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: staticAdapter(),
      paths: {
        // PR previews are served from kept.music/pr-{num}
        base: (process.env.VITE_BASE_URL ?? '') as '' | `/${string}`,
      },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})

/**
 * Central registry of external URLs used across the site.
 *
 * Always add new outbound links here instead of hard-coding URLs in
 * components, so they stay in one place and are easy to mock in tests.
 *
 * Note: the `svelte/no-navigation-without-resolve` ESLint rule flags raw
 * anchor `href` attributes because it expects `resolve()` for internal routes.
 * When linking from a bare `<a>` tag, suppress the rule on the href line with
 * an inline eslint-disable-line comment for `svelte/no-navigation-without-resolve`.
 */
export default {
  /**
   * Loops form endpoint for the launch newsletter (Forms → Settings in Loops).
   * Takes a form-encoded POST with an `email` field and answers with JSON
   * `{ success, message? }`; double opt-in is off, so no confirmation email.
   */
  LOOPS_SUBSCRIBE: 'https://app.loops.so/api/newsletter-form/cmvi30ax507th0j1iu7senj7h',
} as const

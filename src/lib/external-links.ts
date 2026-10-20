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
   * Buttondown's embeddable signup endpoint for the `kept` newsletter. Takes a
   * form POST with an `email` field; Buttondown then emails a confirmation link.
   */
  BUTTONDOWN_SUBSCRIBE: 'https://buttondown.com/api/emails/embed-subscribe/kept',
} as const

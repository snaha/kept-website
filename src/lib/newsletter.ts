import externalLinks from './external-links'

/**
 * Signs `email` up for the launch newsletter, staying on the page.
 *
 * Buttondown's embed endpoint sends no CORS headers, so the request is opaque:
 * the promise resolves once the request went out and rejects only when it
 * could not be sent (offline, blocked). Buttondown itself validates the
 * address and emails the visitor a confirmation link.
 */
export async function subscribe(email: string, fetchFn: typeof fetch = fetch): Promise<void> {
  const body = new FormData()
  body.set('email', email.trim())
  await fetchFn(externalLinks.BUTTONDOWN_SUBSCRIBE, { method: 'POST', mode: 'no-cors', body })
}

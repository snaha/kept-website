import externalLinks from './external-links'

/** A signup Loops refused; `message` is safe to show to the visitor. */
export class SubscribeError extends Error {
  override name = 'SubscribeError'
}

const RATE_LIMITED = 'Too many signups, please try again in a little while.'
const UNEXPECTED = 'Something went wrong. Please try again.'

/**
 * Signs `email` up for the launch newsletter, staying on the page.
 *
 * Posts to the Loops form endpoint, which subscribes the contact right away
 * (single opt-in, no confirmation email). Rejects with a `SubscribeError` when
 * Loops refuses the signup, and with the original error when the request
 * could not be sent (offline, blocked).
 */
export async function subscribe(email: string, fetchFn: typeof fetch = fetch): Promise<void> {
  const body = new URLSearchParams({ email: email.trim() })
  const response = await fetchFn(externalLinks.LOOPS_SUBSCRIBE, { method: 'POST', body })
  if (response.status === 429) throw new SubscribeError(RATE_LIMITED)

  const result: unknown = await response.json().catch(() => undefined)
  if (response.ok && isLoopsResult(result) && result.success) return
  throw new SubscribeError(isLoopsResult(result) && result.message ? result.message : UNEXPECTED)
}

interface LoopsResult {
  success: boolean
  message?: string
}

function isLoopsResult(value: unknown): value is LoopsResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof value.success === 'boolean' &&
    (!('message' in value) || typeof value.message === 'string')
  )
}

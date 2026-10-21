import { describe, expect, it, vi } from 'vitest'

import externalLinks from './external-links'
import { SubscribeError, subscribe } from './newsletter'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('subscribe', () => {
  it('posts the email form-encoded to the Loops form endpoint', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ success: true }))

    await subscribe('fan@example.com', fetchMock)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(externalLinks.LOOPS_SUBSCRIBE)
    expect(init?.method).toBe('POST')
    // A form-encoded body keeps it a simple CORS request, with no preflight
    expect(init?.body).toBeInstanceOf(URLSearchParams)
    expect((init?.body as URLSearchParams).get('email')).toBe('fan@example.com')
  })

  it('trims surrounding whitespace from the email', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ success: true }))

    await subscribe('  fan@example.com ', fetchMock)

    expect((fetchMock.mock.calls[0][1]?.body as URLSearchParams).get('email')).toBe(
      'fan@example.com',
    )
  })

  it('rejects with the message Loops gives when it refuses the signup', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ success: false, message: 'Invalid email.' }, 400))

    const result = subscribe('fan@example', fetchMock)

    await expect(result).rejects.toBeInstanceOf(SubscribeError)
    await expect(result).rejects.toThrow('Invalid email.')
  })

  it('rejects with a retry hint when Loops rate-limits the visitor', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('Too Many Requests', { status: 429 }))

    await expect(subscribe('fan@example.com', fetchMock)).rejects.toThrow(
      'Too many signups, please try again in a little while.',
    )
  })

  it('rejects with a generic message when the response is not what Loops documents', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('<html>Bad Gateway</html>', { status: 502 }))

    await expect(subscribe('fan@example.com', fetchMock)).rejects.toThrow(
      'Something went wrong. Please try again.',
    )
  })

  it('rejects when the request cannot be sent', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(subscribe('fan@example.com', fetchMock)).rejects.toThrow('Failed to fetch')
  })
})

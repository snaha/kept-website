import { describe, expect, it, vi } from 'vitest'

import externalLinks from './external-links'
import { subscribe } from './newsletter'

describe('subscribe', () => {
  it('posts the email to the Buttondown embed endpoint without leaving the page', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(undefined))

    await subscribe('fan@example.com', fetchMock)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(externalLinks.BUTTONDOWN_SUBSCRIBE)
    expect(init?.method).toBe('POST')
    // Buttondown sends no CORS headers, so the request has to be opaque
    expect(init?.mode).toBe('no-cors')
    expect(init?.body).toBeInstanceOf(FormData)
    expect((init?.body as FormData).get('email')).toBe('fan@example.com')
  })

  it('trims surrounding whitespace from the email', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(undefined))

    await subscribe('  fan@example.com ', fetchMock)

    expect((fetchMock.mock.calls[0][1]?.body as FormData).get('email')).toBe('fan@example.com')
  })

  it('rejects when the request cannot be sent', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(subscribe('fan@example.com', fetchMock)).rejects.toThrow('Failed to fetch')
  })
})

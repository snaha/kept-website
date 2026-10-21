<script lang="ts">
  import { Button } from '#lib/components/ui/button/index.ts'
  import { Input } from '#lib/components/ui/input/index.ts'
  import externalLinks from '#lib/external-links.ts'
  import { SubscribeError, subscribe } from '#lib/newsletter.ts'

  type Status = 'idle' | 'sending' | 'done' | 'failed'

  let email = $state('')
  let status = $state<Status>('idle')
  let failure = $state<string>()

  const messages: Record<Status, string> = {
    idle: 'One email when Kept is ready. Nothing else.',
    sending: 'One email when Kept is ready. Nothing else.',
    done: "You're on the list. We'll email you when Kept is ready.",
    failed: 'Something went wrong. Please try again.',
  }

  async function onsubmit(event: SubmitEvent): Promise<void> {
    // Without JavaScript the form posts to Loops in a new tab instead
    event.preventDefault()
    status = 'sending'
    try {
      await subscribe(email)
      status = 'done'
      email = ''
    } catch (error) {
      failure = error instanceof SubscribeError ? error.message : undefined
      status = 'failed'
    }
  }
</script>

<form
  class="flex w-full flex-col items-center gap-4"
  action={externalLinks.LOOPS_SUBSCRIBE}
  method="post"
  target="_blank"
  {onsubmit}
>
  <div class="flex w-full flex-col justify-center gap-2 md:w-auto md:flex-row md:items-center">
    <label class="sr-only" for="email">Email address</label>
    <Input
      id="email"
      name="email"
      type="email"
      autocomplete="email"
      required
      placeholder="your@email.com"
      bind:value={email}
      class="h-8 w-full rounded-[10px] border-white bg-transparent px-2.5 py-1 text-base leading-5 text-white placeholder:text-white md:w-[273px] md:text-base dark:bg-transparent"
    />
    <Button
      type="submit"
      disabled={status === 'sending'}
      class="h-8 w-full rounded-[10px] bg-white px-2.5 py-2 text-sm leading-5 font-semibold text-black uppercase hover:bg-white/85 md:w-auto"
    >
      Notify me at launch
    </Button>
  </div>
  <p class="text-center text-sm leading-[normal] text-white" role="status">
    {status === 'failed' && failure ? failure : messages[status]}
  </p>
</form>

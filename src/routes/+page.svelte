<script lang="ts">
  import grain from '#lib/assets/grain.svg'
  import logo from '#lib/assets/logo.svg'

  import AlbumGrid from './album-grid.svelte'
  import SignupForm from './signup-form.svelte'

  const title = 'Kept — Rediscover your own music'
  const description =
    'Kept is a music library for the songs you own: downloaded MP3s, purchased digital albums and the CDs you ripped years ago.'
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="https://kept.music/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kept.music/" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<div class="backdrop" aria-hidden="true"></div>
<AlbumGrid />
<div class="shade pointer-events-none fixed inset-0" aria-hidden="true"></div>

<main
  class="relative grid min-h-dvh grid-rows-[1fr_auto_1fr] justify-items-center p-4 text-white md:p-8"
>
  <header class="self-start pt-4 pb-8 md:pt-0">
    <img src={logo} alt="Kept" class="h-6 w-auto md:h-9" width="78" height="36" />
  </header>

  <div class="flex w-full flex-col items-center gap-12">
    <div class="flex w-full flex-col items-center gap-6 text-center md:gap-2">
      <p class="font-display text-lg leading-[normal] italic md:text-2xl">
        Building a music library takes effort. Enjoying it shouldn’t.
      </p>
      <h1 class="headline font-semibold uppercase">
        <span>Rediscover</span>
        <span>your own</span>
        <span>music</span>
      </h1>
      <p class="max-w-[700px] text-lg leading-[normal] md:max-w-[720px] md:text-2xl">
        Kept is a music library for the songs you own. Somewhere there’s a folder of downloaded
        MP3s, purchased digital albums, or CDs you ripped years ago. That collection is yours, and
        it’s worth keeping. Songs can reconnect us with who we were, how we felt, and moments that
        moved us. Your library is a gold mine. Kept helps you dig in.
      </p>
    </div>

    <SignupForm />
  </div>
</main>

<div
  class="grain pointer-events-none fixed inset-0"
  style:background-image="url({grain})"
  aria-hidden="true"
></div>

<style>
  /* Shows before the covers fade in; the cover grid paints over it. */
  .backdrop {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      65.43% 65.43% at 50% 34.57%,
      #2e2e2e 0%,
      #171717 50%,
      #0b0b0b 75%,
      #060606 87.5%,
      #000 100%
    );
  }

  /* Darkens and softens the covers towards the edges so the copy stays readable */
  .shade {
    background: radial-gradient(closest-side, rgb(0 0 0 / 25%), #000);
    backdrop-filter: blur(2px);
  }

  /* Figma's noise effect covers the whole frame, copy included */
  .grain {
    background-size: 256px;
    opacity: 0.105;
  }

  /* Figma's sizes fit its 360px and 1366px frames; on narrower viewports the
     headline shrinks so its lines don't wrap. The divisors are the line width
     in ems: "REDISCOVER" when stacked, the whole headline when on one line
     (plus some slack). */
  .headline {
    display: flex;
    flex-direction: column;
    font-size: min(60px, (100vw - 32px) / 5.2);
    line-height: calc(50 / 60);
  }

  /* On one line the words are inline, so the spaces between them show */
  @media (width >= 64rem) {
    .headline {
      display: block;
      font-size: min(96.628px, (100vw - 64px) / 12.9);
      line-height: normal;
    }
  }
</style>

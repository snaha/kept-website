<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import { shuffle, splitIntoRows } from '#lib/album-rows.ts'

  const ROW_COUNT = 5
  /** Each row is rendered this many times back to back so the loop is seamless. */
  const COPIES = 3
  /** Seconds a row takes to travel the length of its own covers once. */
  const LOOP_SECONDS = 140

  const covers = Object.values(
    import.meta.glob<string>('../lib/assets/covers/*.webp', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  )

  interface Row {
    covers: string[]
    /** Negative delay so every row starts at a different point of its loop. */
    delaySeconds: number
  }

  // Shuffled on every visit, so this only renders in the browser: a shuffle
  // during prerendering would be baked into the HTML and then reshuffled on
  // hydration.
  let rows = $state<Row[]>()

  onMount(() => {
    rows = splitIntoRows(shuffle(covers), ROW_COUNT).map((rowCovers) => ({
      covers: rowCovers,
      delaySeconds: -Math.random() * LOOP_SECONDS,
    }))
  })
</script>

<div class="album-grid pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
  {#if rows}
    <div
      class="flex h-full flex-col justify-center gap-(--gap) bg-black opacity-75"
      transition:fade={{ duration: 1200 }}
    >
      {#each rows as row, index (index)}
        <div
          class="row flex w-max"
          class:reverse={index % 2 === 1}
          style:animation-duration="{LOOP_SECONDS}s"
          style:animation-delay="{row.delaySeconds}s"
        >
          {#each { length: COPIES } as _, copy (copy)}
            {#each row.covers as cover (cover)}
              <img class="tile" src={cover} alt="" decoding="async" draggable="false" />
            {/each}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .album-grid {
    --gap: 16px;
    /* Five rows and four gaps fill the viewport height exactly */
    --tile: calc((100dvh - 4 * var(--gap)) / 5);
  }

  .tile {
    width: var(--tile);
    height: var(--tile);
    margin-right: var(--gap);
    flex-shrink: 0;
    object-fit: cover;
    user-select: none;
  }

  /* Every tile carries its own trailing gap, so one copy of the covers is
     exactly a third of the row and shifting by it loops without a seam. */
  .row {
    animation-name: slide-left;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
  }

  .row.reverse {
    animation-name: slide-right;
  }

  @keyframes slide-left {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(calc(-100% / 3), 0, 0);
    }
  }

  @keyframes slide-right {
    from {
      transform: translate3d(calc(-100% / 3), 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .row {
      animation-play-state: paused;
    }
  }
</style>

<script lang="ts">
  import basierRegular from '#lib/assets/fonts/BasierCircleNarrow-Regular.woff2'
  import basierSemiBold from '#lib/assets/fonts/BasierCircleNarrow-SemiBold.woff2'
  import novelaItalic from '#lib/assets/fonts/Novela-DisplayItalic.woff2'

  import '../app.css'

  let { children } = $props()
</script>

<svelte:head>
  <!-- The hero copy is the first thing on screen: fetch its fonts right away -->
  {#each [basierRegular, basierSemiBold, novelaItalic] as font (font)}
    <link rel="preload" href={font} as="font" type="font/woff2" crossorigin="anonymous" />
  {/each}
</svelte:head>

{@render children()}

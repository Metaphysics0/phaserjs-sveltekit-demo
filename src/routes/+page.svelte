<script lang="ts">
  import PhaserGame, { type TPhaserRef } from "../PhaserGame.svelte";

  //  References to the PhaserGame component (game and scene are exposed)
  let phaserRef: TPhaserRef = { game: null, scene: null };
</script>

<div id="app">
  <PhaserGame bind:phaserRef />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    position: relative;
  }

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    :global(body) {
      overflow: hidden; /* Prevent scrolling on mobile only */
    }

    #app {
      min-height: 100vh;
      height: 100vh;
      width: 100vw;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
  }

  /* iPhone specific optimizations */
  @media (max-width: 414px) and (orientation: portrait) {
    #app {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }
</style>

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
  }
</style>

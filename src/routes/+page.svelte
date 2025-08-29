<script lang="ts">
  import type { Scene } from "phaser";
  import PhaserGame, { type TPhaserRef } from "../PhaserGame.svelte";

  //  References to the PhaserGame component (game and scene are exposed)
  let phaserRef: TPhaserRef = { game: null, scene: null };
</script>

<div id="app">
  <PhaserGame bind:phaserRef />
</div>

<style>
</style>

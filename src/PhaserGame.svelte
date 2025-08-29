<script context="module" lang="ts">
  import type { Game, Scene } from "phaser";

  export type TPhaserRef = {
    game: Game | null;
    scene: Scene | null;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import StartGame from "./game/main";
  import { EventBus } from "./game/EventBus";

  export let phaserRef: TPhaserRef = {
    game: null,
    scene: null,
  };

  export let currentActiveScene: (scene: Scene) => void | undefined = () => {
    console.log("currentActiveScene");
  };

  onMount(() => {
    phaserRef.game = StartGame("game-container");

    EventBus.on("current-scene-ready", (scene_instance: Scene) => {
      phaserRef.scene = scene_instance;

      if (currentActiveScene) {
        currentActiveScene(scene_instance);
      }
    });
  });
</script>

<div id="game-container"></div>

<style>
  #game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  #game-container canvas {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  /* Desktop-specific styles */
  @media (min-width: 769px) {
    #game-container {
      max-width: 800px;
      max-height: 600px;
      margin: 0 auto;
    }

    #game-container canvas {
      max-width: 800px;
      max-height: 600px;
    }
  }

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    #game-container {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    :global(#game-container canvas) {
      margin-top: 0 !important;
      max-width: 100vw;
      max-height: 100vh;
    }
  }
</style>

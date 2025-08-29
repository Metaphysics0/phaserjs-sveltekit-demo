import { Game as MainGame } from "./scenes/Game";
import { Game, type Types } from "phaser";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300, x: 0 },
      debug: false,
    },
  },
  scene: [MainGame],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;

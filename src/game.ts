import "phaser";
import { Home } from "./game-scenes/home";
import { Town } from "./game-scenes/town";
import Start from "./start";
import GameOver from "./game-over";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#D9F7CA",
  width: 800,
  height: 600,
  scene: [Start, Home, Town, GameOver],
  pixelArt: true,
  antialias: false,
  autoRound: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);

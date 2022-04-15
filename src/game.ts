import "phaser";
import { Home } from "./game-scenes/home";
import { Town } from "./game-scenes/town";
import Start from "./start";
import GameOver from "./game-over";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#b4cdd6",
  width: 800,
  height: 600,
  scene: [Start, Home, Town, GameOver],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);

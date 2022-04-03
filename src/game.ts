import "phaser";
import { Home } from "./game-scenes/home";
import { Town } from "./game-scenes/town";
import Start from "./start";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 800,
  height: 600,
  scene: [Start, Home, Town],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);

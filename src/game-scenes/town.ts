import { BaseScene } from "../utils/BaseScene";

export class Town extends BaseScene {
  todos = [
    {
      id: "groceries",
      text: "Buy groceries while trying to reduce my carbon footprint",
      done: false,
    },
    {
      id: "send-letter",
      text: "Send a letter to the president",
      done: false,
    },
  ];

  constructor() {
    super("town");
  }

  preload() {
    this.load.image("tiles", "/assets/tilemaps/floor.png");
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/town.json");
  }

  create() {
    super.create();
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("town", "tiles");
    const layer = map.createLayer("ground", tileset, 0, 0);
    layer.setDepth(-1);
  }

  update() {
    super.update();
  }
}

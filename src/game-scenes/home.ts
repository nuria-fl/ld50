import "phaser";

import { BaseScene } from "../utils/BaseScene";

export class Home extends BaseScene {
  todos = [
    {
      id: "write-letter",
      text: "Write a letter to the president",
      done: false,
    },
    {
      id: "leaflets",
      text: "Pick up leaflets",
      done: false,
    },
  ];
  private door: Phaser.Physics.Arcade.Image;
  private table: Phaser.Physics.Arcade.Image;
  private smallTable: Phaser.Physics.Arcade.Image;
  private leaflets: Phaser.Physics.Arcade.Image;
  private houseItems: Phaser.Physics.Arcade.StaticGroup;
  private fx_door: any = null;

  constructor() {
    super("home");
  }

  preload() {
    this.load.audio("fx_door", ["assets/audio/fx_cross_door.mp3"]);
    this.load.image("table", "assets/sprites/table.png");
    this.load.image("door", "assets/sprites/door.png");
    this.load.image("house-top", "assets/sprites/house-top.png");
    this.load.image("house-bottom", "assets/sprites/house-bottom.png");
    this.load.image("wall", "assets/sprites/wall.png");
    this.load.image("dinner-table", "assets/sprites/dinner-table.png");
    this.load.image("kitchen", "assets/sprites/kitchen.png");
    this.load.image("sofa", "assets/sprites/sofa.png");
    this.load.image("small-table", "assets/sprites/small-table.png");
    this.load.image("leaflets", "assets/sprites/leaflets.png");
  }

  async create() {
    super.create();
    this.cameras.main.setBackgroundColor("#222222");

    this.createHouse();

    this.door = this.physics.add.staticImage(499, 400, "door");
    this.table = this.physics.add.staticImage(480, 200, "table");
    this.smallTable = this.physics.add.staticImage(270, 150, "small-table");
    this.leaflets = this.physics.add.staticImage(272, 147, "leaflets");

    this.physics.add.collider(this.player, this.door, async () => {
      if (!this.areTodosCompleted()) {
        await this.createDialogBox(
          "I must complete my todo list before heading to town!"
        );
        return;
      }
      this.fx_door = this.sound.add("fx_door");
      this.fx_door.play();
      this.scene.start("town");
    });
    this.physics.add.collider(this.player, this.table, async () => {
      if (!this.todos[0].done) {
        this.player.disableMovement();
        await this.createDialogBox("Dear Mrs President…");
        this.todos[0].done = true;
        this.player.enableMovement();
      }
    });

    this.physics.add.collider(this.player, this.smallTable, async () => {
      if (!this.todos[1].done) {
        this.player.disableMovement();
        await this.createDialogBox(
          "Ok, I can hand out this leaflets to the neighbours."
        );
        this.leaflets.destroy();
        this.todos[1].done = true;
        this.player.enableMovement();
      }
    });

    this.physics.add.collider(this.player, this.houseItems);
    await this.createDialogBox(
      "Oh no! My data shows that the climate change is reaching the point of no return."
    );
    await this.createDialogBox(
      "I must prevent this! I can move around with the cursor keys and view the list of things I need to do by pressing T."
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  createHouse() {
    const floor = this.add.graphics();
    floor.fillStyle(0xd9f7ca);
    floor.fillRect(241, 120, 320, 250);
    floor.setDepth(-1);

    this.houseItems = this.physics.add.staticGroup();

    this.houseItems.create(241, 250, "wall").setScale(1, 50).refreshBody();
    this.houseItems.create(559, 250, "wall").setScale(1, 50).refreshBody();
    this.houseItems.create(400, 100, "house-top");
    this.houseItems.create(400, 400, "house-bottom");

    this.houseItems.create(380, 340, "dinner-table");
    this.houseItems.create(268, 329, "kitchen");
    this.houseItems.create(263, 200, "sofa");
  }
}

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
  private door: Phaser.Physics.Arcade.StaticGroup;
  private table: Phaser.Physics.Arcade.Image;
  private leaflets: Phaser.Physics.Arcade.Image;
  private fx_door: any = null;

  constructor() {
    super("home");
  }

  preload() {
    this.load.audio("fx_door", ["assets/audio/fx_cross_door.mp3"]);
    this.load.image("table", "assets/sprites/table.png");
  }

  async create() {
    super.create();

    this.door = this.physics.add.staticGroup();
    this.door.create(500, 500);
    this.table = this.physics.add.staticImage(300, 200, "table");
    this.table.setScale(2, 2);
    this.leaflets = this.physics.add.staticImage(200, 500, "leaflets");

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

    this.physics.add.collider(this.player, this.leaflets, async () => {
      if (!this.todos[1].done) {
        this.player.disableMovement();
        await this.createDialogBox(
          "Ok, I can hand out this leaflets to the neighbours."
        );
        this.todos[1].done = true;
        this.player.enableMovement();
      }
    });

    await this.createDialogBox(
      "Oh no! My data shows that the climate change is reaching the point of no return."
    );
    await this.createDialogBox(
      "I must prevent this! I can view the list of things I need to do by pressing the T key."
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  areTodosCompleted() {
    for (const todo of this.todos) {
      if (!todo.done) {
        return false;
      }
    }
    return true;
  }
}

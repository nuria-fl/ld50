import "phaser";

import { PlayerSprite } from "../sprites/player";
import { DialogService } from "../utils/Dialog";
import { BaseScene } from "../utils/BaseScene";

export class Home extends BaseScene {
  public stairs: Phaser.Physics.Arcade.StaticGroup;
  private fx_door: any = null;

  constructor() {
    super("home");
  }

  preload() {
    this.load.audio("fx_door", ["assets/audio/fx_cross_door.mp3"]);
  }

  async create() {
    super.create();

    this.stairs = this.physics.add.staticGroup();
    this.stairs.create(500, 500);

    this.physics.add.collider(this.player, this.stairs, () => {
      this.fx_door = this.sound.add("fx_door");
      this.fx_door.play();
      this.scene.start("town");
    });
    await this.createDialogBox(
      "Oh no! My data shows that the climate change is reaching the point of no return."
    );
    await this.createDialogBox("I must prevent this! I can view the list of things I need to do by pressing the T key.");
  }

  update() {
    super.update();
  }
}

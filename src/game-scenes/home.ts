import "phaser";

import { PlayerSprite } from "../sprites/player";
import { DialogService } from "../utils/Dialog";
import { SceneWithDialog } from "../utils/SceneWithDialog";

export class Home extends SceneWithDialog {
  public player: PlayerSprite;
  public stairs: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("home");
  }

  preload() { }

  async create() {
    this.dialog = new DialogService(this);
    this.player = new PlayerSprite(this, 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stairs = this.physics.add.staticGroup();
    this.stairs.create(500, 500);

    this.cameras.main.setBounds(0, 0, 10000, 10000);
    this.cameras.main.startFollow(this.player, false);

    this.physics.add.collider(this.player, this.stairs, () => {
      this.scene.start("town");
    });
    await this.createDialogBox(
      "Oh no! My data shows that the climate change is reaching a point of no return. I need to fix this!"
    );
    await this.createDialogBox("I need to shop for groceries, send a letter to the president");
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else if (this.cursors.up.isDown) {
      this.player.moveUp();
    } else if (this.cursors.down.isDown) {
      this.player.moveDown();
    } else {
      this.player.moveStop();
    }
  }

  async createDialogBox(text: string) {
    this.player.disableMovement()
    return this.dialog.createDialogBox(text).then(() => this.player.enableMovement());
  }
}

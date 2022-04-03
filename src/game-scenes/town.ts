import "phaser";
import { PlayerSprite } from "../sprites/player";

export class Town extends Phaser.Scene {
  public player: PlayerSprite;
  public stairs: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("town");
  }

  preload() {}

  create() {
    this.player = new PlayerSprite(this, 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();
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
      this.player.stop();
      this.player.moveStop();
    }
  }
}

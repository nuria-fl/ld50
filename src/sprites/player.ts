const MOVE_SPEED = 150;

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;
  private canMove = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player_idle");

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.moveSpeed = MOVE_SPEED;
  }

  public moveLeft(): void {
    if (this.canMove) {
      this.setVelocityX(-this.moveSpeed);
      this.flipX = true;
    }
  }

  public moveRight(): void {
    if (this.canMove) {
      this.setVelocityX(this.moveSpeed);
      this.flipX = false;
    }
  }

  public moveUp(): void {
    if (this.canMove) {
      this.setVelocityY(-this.moveSpeed);
      this.flipX = true;
    }
  }

  public moveDown(): void {
    if (this.canMove) {
      this.setVelocityY(this.moveSpeed);
      this.flipX = false;
    }
  }

  public moveStop() {
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.stop();
  }

  public disableMovement() {
    this.canMove = false;
    this.moveStop();
  }

  public enableMovement() {
    this.canMove = true;
  }

  public toggleMovement() {
    this.canMove = !this.canMove;
  }
}

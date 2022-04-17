const MOVE_SPEED = 350;

export class CarSprite extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;
  private canMove = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "car");

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.moveSpeed = MOVE_SPEED;
    this.setFrame(0);
  }

  public moveLeft(): void {
    if (this.canMove) {
      this.setVelocityX(-this.moveSpeed);
      this.flipX = true;

      this.setFrame(0);
    }
  }

  public moveRight(): void {
    if (this.canMove) {
      this.setVelocityX(this.moveSpeed);
      this.flipX = false;

      this.setFrame(0);
    }
  }

  public moveUp(): void {
    if (this.canMove) {
      this.setVelocityY(-this.moveSpeed);
      this.flipX = false;

      this.setFrame(1);
    }
  }

  public moveDown(): void {
    if (this.canMove) {
      this.setVelocityY(this.moveSpeed);
      this.flipX = false;

      this.setFrame(2);
    }
  }

  public moveStop() {
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.stop();
  }

  public disableMovement() {
    this.canMove = false;
  }

  public enableMovement() {
    this.canMove = true;
  }

  public toggleMovement() {
    this.canMove = !this.canMove;
  }
}

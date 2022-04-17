export class ToDoList {
  graphics: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
  isVisible = false;
  config = {
    width: 400,
    height: 500,
    padding: 20,
  };
  todos: any;

  constructor(private readonly scene: Phaser.Scene, todos: any[]) {
    this.todos = todos;
  }

  // Gets the width of the game (based on the scene)
  private getGameWidth() {
    return Number(this.scene.sys.game.config.width);
  }

  // Gets the height of the game (based on the scene)
  private getGameHeight() {
    return Number(this.scene.sys.game.config.height);
  }

  private createWindow() {
    this.graphics = this.scene.add.graphics();
    const { x, y } = this.calculateWindowDimensions();
    this.graphics.fillStyle(0xd9f7ca);
    this.graphics.defaultStrokeColor = 0x222222;
    this.graphics.fillRect(x, y, this.config.width, this.config.height);
    this.graphics.strokeRect(x, y, this.config.width, this.config.height);
    this.setDialogText();
  }

  private setDialogText() {
    // Reset the dialog
    if (this.text) {
      this.text.destroy();
    }

    const dimensions = this.calculateWindowDimensions();

    const x = dimensions.x + this.config.padding;
    const y = dimensions.y + this.config.padding;

    const list = this.todos
      .map((todo) => `${todo.done ? "✔️" : " "} ${todo.text}`)
      .join("\n\n");

    this.text = this.scene.make.text({
      x,
      y,
      text: list,
      style: {
        fontFamily: "VT323, monospace",
        fontSize: "28px",
        color: "#000",
        padding: { y: 5 },
        wordWrap: { width: this.config.width - this.config.padding },
      },
    });
  }

  private calculateWindowDimensions() {
    const x =
      this.scene.cameras.main.scrollX +
      this.getGameWidth() / 2 -
      this.config.width / 2;
    const y =
      this.scene.cameras.main.scrollY +
      this.getGameHeight() / 2 -
      this.config.height / 2;

    return {
      x,
      y,
    };
  }

  toggle(): void {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      this.createWindow();
      return;
    }

    this.graphics.destroy();
    this.text.destroy();
  }
}

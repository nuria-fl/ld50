export class ToDoList {
  graphics: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
  isVisible = false;
  config = {
    width: 400,
    height: 500
  }
  todos = [
    {
      id: "groceries",
      text: "Buy groceries",
      done: false
    },
    {
      id: "letter",
      text: "Send a letter to the president",
      done: false
    },
  ]

  constructor(private readonly scene: Phaser.Scene) { }

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
    const { x, y } = this.calculateWindowDimensions()
    this.graphics.fillStyle(0xffffff);
    this.graphics.fillRect(x, y, this.config.width, this.config.height);
    this.setDialogText()
  }

  private setDialogText() {
    // Reset the dialog
    if (this.text) {
      this.text.destroy();
    }

    const dimensions = this.calculateWindowDimensions();

    const x = dimensions.x + 20;
    const y = dimensions.y + 20;

    const list = this.todos.map(todo => todo.text).join("\n\n")

    this.text = this.scene.make.text({
      x,
      y,
      text: list,
      style: {
        fontFamily: "Courier New, monospace",
        fontSize: "24px",
        color: "#000",
        wordWrap: { width: this.config.width },
      },
    });
  }

  private calculateWindowDimensions() {
    
    const x = this.scene.cameras.main.scrollX + this.getGameWidth() / 2 - this.config.width / 2;
    const y = this.scene.cameras.main.scrollY + this.getGameHeight() / 2 - this.config.height / 2 

    return {
      x,
      y,
    };
  }

  toggle(): void {  
    this.isVisible = !this.isVisible  

    if (this.isVisible) {
      this.createWindow();
      return
    }
    
    this.graphics.destroy()
    this.text.destroy()
  }
}

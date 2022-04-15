export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  preload() {}

  create() {
    this.add
      .text(270, 270, "Game Over", {
        fontFamily: "Courier New",
        fontSize: "40px",
        color: "#fff",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.goToPlay();
      });

    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      this.goToPlay();
    });
  }

  goToPlay() {
    window.location.reload();
  }
}

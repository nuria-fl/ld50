export default class Start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  preload() {}

  create() {
    this.add
      .text(270, 270, "Start Game", {
        fontFamily: "Courier New",
        fontSize: "40px",
        color: "#fff",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.goToPlay();
      });

    this.input.keyboard.on("keydown", () => {
      this.goToPlay();
    });
  }

  goToPlay() {
    this.scene.start("home");
  }
}

export default class Start extends Phaser.Scene {
  constructor() {
    super("start");
  }

  preload() {
    this.load.audio("bg_music_menu", [
      "assets/audio/bg_music_intro.m4a",
      "assets/audio/bg_music_intro.mp3",
      "assets/audio/bg_music_intro.ogg",
    ]);
  }

  create() {
    var music = this.sound.add("bg_music_menu");
    music.play({
      loop: true,
      volume: 0.1,
    });

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

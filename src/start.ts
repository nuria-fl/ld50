export default class Start extends Phaser.Scene {
  music: any = null;
  is_muted: boolean = false;

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
    this.music = this.sound.add("bg_music_menu");
    this.music.play({
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

    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      if (event.key == "m") {
        if (this.is_muted) {
          console.log("unmuted");
          this.music.mute = false;
          this.music.play({
            loop: true,
            volume: 0.1,
          });
        } else {
          console.log("muted");
          this.music.mute = true;
          this.music.volume = 0;
        }

        this.is_muted = !this.is_muted;

        return;
      }

      this.goToPlay();
    });
  }

  goToPlay() {
    this.scene.start("home");
  }
}

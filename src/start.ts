export default class Start extends Phaser.Scene {
  music: any = null;
  is_muted: boolean = false;

  constructor() {
    super("start");
  }

  preload() {
    this.load.audio("bg_music_menu", [
      "assets/audio/bg_music_intro8bit-ish.m4a",
      "assets/audio/bg_music_intro8bit-ish.mp3",
      "assets/audio/bg_music_intro8bit-ish.ogg",
    ]);
    this.load.spritesheet([
      {
        key: "player_idle",
        url: "./assets/sprites/scientist.png",
        frameConfig: {
          frameWidth: 32,
          frameHeight: 42,
          startFrame: 0,
          endFrame: 0,
        },
      },
    ]);
  }

  create() {
    this.music = this.sound.add("bg_music_menu");
    this.music.play({
      loop: true,
      volume: 0.5,
    });

    this.add
      .text(270, 270, "Start Game", {
        fontFamily: "Courier New",
        fontSize: "40px",
        color: "#222",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.goToPlay();
      });

    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      if (event.key == "m") {
        if (this.is_muted) {
          this.music.mute = false;
          this.music.play({
            loop: true,
            volume: 0.5,
          });
        } else {
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

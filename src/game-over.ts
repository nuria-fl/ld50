export default class GameOver extends Phaser.Scene {
  todos: {
    id: string;
    text: string;
    done: boolean;
  }[];
  groceriesChosenOption: number;
  years: number;
  yearsByTodo = {
    groceries: {
      1: 2,
      2: -0.5,
      3: -1,
    },
    sendLetter: -0.5,
    talk: -0.5,
    garden: -1,
  };

  constructor() {
    super("game-over");
  }

  preload() {
    this.load.audio("fx_endgame", ["assets/audio/endgame.mp3"]);
  }

  create({ todos, groceriesChosenOption, hasDrivenCar }) {
    this.todos = todos;
    this.groceriesChosenOption = todos;
    this.years = this.todos.reduce((acc: number, todo) => {
      if (!todo.done) {
        acc++;
        return acc;
      }
      if (todo.id === "groceries") {
        acc += this.yearsByTodo[todo.id][groceriesChosenOption];
        return acc;
      }
      acc += this.yearsByTodo[todo.id];
      return acc;
    }, 0);

    if (hasDrivenCar) {
      this.years += 5;
    }

    let text: string;
    if (this.years === 0) {
      text =
        "You didn't manage to alter climate change. We will reach the point of no return in 10 years as you initially calculated.";
    } else if (this.years > 0) {
      text = `You actually managed to speed up climate change.\nWe will reach the point of no return ${this.years} years sooner than expected.`;
    } else {
      text = `Congratulations, you managed to delay climate change.\nWe will reach the point of no return ${(this.years *=
        -1)} years later than expected.`;
    }

    this.add.text(303, 210, "Game Over", {
      fontFamily: "VT323, monospace",
      fontSize: "50px",
      color: "#d9f7ca",
    });
    this.add.text(100, 280, text, {
      fontFamily: "VT323, monospace",
      fontSize: "28px",
      align: "center",
      color: "#d9f7ca",
      padding: { y: 5 },
      wordWrap: { width: 600 },
    });
    this.add
      .text(320, 390, "Try again?", {
        fontFamily: "VT323, monospace",
        fontSize: "35px",
        color: "#d9f7ca",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.goToPlay();
      });
    const fx_endgame = this.sound.add("fx_endgame");
    fx_endgame.play();
  }

  goToPlay() {
    window.location.reload();
  }
}

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

  preload() {}

  create({ todos, groceriesChosenOption }) {
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

    this.add.text(291, 250, "Game Over", {
      fontFamily: "Courier New",
      fontSize: "40px",
      fontStyle: "bold",
      color: "#222",
    });
    this.add.text(100, 290, text, {
      fontFamily: "Courier New, monospace",
      fontSize: "24px",
      align: "center",
      color: "#000",
      padding: { y: 5 },
      wordWrap: { width: 600 },
    });
    this.add
      .text(310, 400, "Try again?", {
        fontFamily: "Courier New",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#222",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.goToPlay();
      });
  }

  goToPlay() {
    window.location.reload();
  }
}

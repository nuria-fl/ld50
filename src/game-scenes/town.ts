import { BaseScene } from "../utils/BaseScene";

export class Town extends BaseScene {
  todos = [
    {
      id: "groceries",
      text: "Buy groceries while trying to reduce my carbon footprint",
      done: false,
    },
    {
      id: "send-letter",
      text: "Send a letter to the president",
      done: false,
    },
    {
      id: "talk",
      text: "Spread the word by talking to 5 neighbours",
      done: false,
    },
  ];
  groceriesStore: any;
  postalOffice: any;
  groceriesChosenOption: string;
  HUDmoney: Phaser.GameObjects.Text;
  HUDtime: Phaser.GameObjects.Text;
  timeLeft = 3 * 59 * 1000;
  neighboursTalkedTo = 0;
  money = 100;

  constructor() {
    super("town");
  }

  preload() {
    this.load.image("tiles", "/assets/tilemaps/floor.png");
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/town.json");
  }

  async create() {
    super.create();
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("town", "tiles");
    const layer = map.createLayer("ground", tileset, 0, 0);
    layer.setDepth(-1);

    this.HUDmoney = this.add.text(710, 30, `💸 ${this.money}`, {
      padding: { y: 3 },
    });
    this.HUDmoney.setScrollFactor(0, 0);
    this.HUDtime = this.add.text(630, 30, `⏰ ${this.timeLeft}`, {
      padding: { y: 3 },
    });
    this.HUDtime.setScrollFactor(0, 0);

    this.setupGroceriesStore();
    this.setupPostalOffice();

    await this.createDialogBox(
      "Lots to do before the stores close! I don't have much time. I could drive but that doesn't help the planet…"
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.timeLeft -= delta;
    this.updateTime();
  }

  setupGroceriesStore() {
    const options = {
      1: 30,
      2: 40,
      3: 50,
    };

    this.groceriesStore = this.physics.add.staticImage(
      300,
      500,
      "groceriesStore"
    );

    this.physics.add.collider(this.player, this.groceriesStore, async () => {
      if (this.todos[0].done) {
        await this.createDialogBox("I already have my groceries");
        return;
      }
      await this.createInteractionBox(
        `What should I buy? (Choose by pressing 1-3 key)\n1: Lots of cheap meat $30\n2: Vegetarian food $40\n3: Vegan proximity food $50`
      );
      this.input.keyboard.once("keydown", async (ev: KeyboardEvent) => {
        const key = ev.key;
        if (key === "1" || key === "2" || key === "3") {
          this.decreaseMoney(options[key]);
          this.groceriesChosenOption = key;
          this.todos[0].done = true;
          this.closeInteractionBox();
          return;
        }
        this.closeInteractionBox();
      });
    });
  }

  setupPostalOffice() {
    this.postalOffice = this.physics.add.staticImage(600, 300, "postalOffice");

    this.physics.add.collider(this.player, this.postalOffice, async () => {
      if (this.todos[1].done) {
        await this.createDialogBox("I already sent the letter");
        return;
      }
      await this.createInteractionBox(
        `Send the letter? It's $10 (Press Y to confirm)`
      );
      this.input.keyboard.once("keydown", async (ev: KeyboardEvent) => {
        const key = ev.key.toLowerCase();

        if (key === "y") {
          this.decreaseMoney(10);
          this.todos[1].done = true;
          this.closeInteractionBox();
          return;
        }
        this.closeInteractionBox();
      });
    });
  }

  decreaseMoney(amount: number) {
    this.money -= amount;
    this.HUDmoney.text = `💸 ${this.money}`;
    this.HUDmoney.updateText();
  }

  updateTime() {
    const minutes = Math.floor(this.timeLeft / 60000);
    const seconds = (this.timeLeft % 60000) / 1000;
    const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds.toFixed(0)}`;
    const displayTime = `⏰ ${minutes}:${displaySeconds}`;
    this.HUDtime.text = displayTime;
    this.HUDtime.updateText();

    if (this.timeLeft <= 0) {
      this.scene.start("game-over");
    }
  }
}

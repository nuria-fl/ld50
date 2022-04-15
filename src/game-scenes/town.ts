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
      text: "Spread the word by talking to 5 neighbours (0/5)",
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
      color: "#222",
    });
    this.HUDmoney.setScrollFactor(0, 0);
    this.HUDtime = this.add.text(630, 30, `⏰ ${this.timeLeft}`, {
      padding: { y: 3 },
      color: "#222",
    });
    this.HUDtime.setScrollFactor(0, 0);

    this.setupGroceriesStore();
    this.setupPostalOffice();

    this.setupNeighbourAbby();
    this.setupNeighbourChloe();
    this.setupNeighbourEllie();
    this.setupNeighbourJoel();
    this.setupNeighbourNate();

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

  setupNeighbourAbby() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(400, 800, "abby");

    this.physics.add.collider(this.player, neighbour, async () => {
      if (talkedTo) {
        await this.createDialogBox("Have a nice day Abby!");
        return;
      }
      await this.createDialogBox("Hi Abby! Do you have a minute?");
      await this.createDialogBox("Abby: well I…");
      await this.createDialogBox(
        "Temperatures are reaching a point of no return. That means if we don't take action now, we won't be able to stop the climate change!"
      );
      await this.createDialogBox(
        "Here's a leaflet with more information. Thanks for your help!"
      );
      await this.createDialogBox("Abby: uhmm ok");
      this.talkToNeighbour();
      talkedTo = true;
    });
  }

  setupNeighbourChloe() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(1400, 1800, "chloe");

    this.physics.add.collider(this.player, neighbour, async () => {
      if (talkedTo) {
        await this.createDialogBox("Enjoy your day Chloe!");
        return;
      }
      await this.createDialogBox(
        "Good evening Chloe! I have to tell you something."
      );
      await this.createDialogBox("Chloe: Yeah? What is it?");
      await this.createDialogBox(
        "As you may know I'm studying climate change. I've just found out that our actions are causing big trouble and we are reaching a point of no return. We must do something now!"
      );
      await this.createDialogBox(
        "Here's a leaflet with more information. Thanks for your help!"
      );
      await this.createDialogBox("Chloe: Oh geez.");
      this.talkToNeighbour();
      talkedTo = true;
    });
  }

  setupNeighbourJoel() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(800, 400, "joel");

    this.physics.add.collider(this.player, neighbour, async () => {
      if (talkedTo) {
        await this.createDialogBox("See you around Joel!");
        return;
      }
      await this.createDialogBox("Hi Joel! How are you doing?");
      await this.createDialogBox("Joel: Peachy. You?");
      await this.createDialogBox(
        "Well, better than the planet. Did you know we are reaching a point of no return? We need to change our habits if we want to stop it."
      );
      await this.createDialogBox(
        "Here's a leaflet with more information. Thanks for your help!"
      );
      await this.createDialogBox("Joel: Awesome.");
      this.talkToNeighbour();
      talkedTo = true;
    });
  }

  setupNeighbourEllie() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(800, 800, "ellie");

    this.physics.add.collider(this.player, neighbour, async () => {
      if (talkedTo) {
        await this.createDialogBox("See ya Ellie!");
        return;
      }
      await this.createDialogBox("Ellie! Just who I wanted to see.");
      await this.createDialogBox("Ellie: *looks at you suspiciously*");
      await this.createDialogBox(
        "I have some bad news. According to my calculations, climate change could kill us all if we don't take action now. But if we work together we can stop it!"
      );
      await this.createDialogBox(
        "Here's a leaflet with more information. Thanks for your help!"
      );
      await this.createDialogBox("Ellie: *blank stare*");
      this.talkToNeighbour();
      talkedTo = true;
    });
  }

  setupNeighbourNate() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(1000, 1200, "nate");

    this.physics.add.collider(this.player, neighbour, async () => {
      if (talkedTo) {
        await this.createDialogBox("Have a nice day Nate!");
        return;
      }
      await this.createDialogBox("Hey Nate!");
      await this.createDialogBox("Nate: Hello! How are you?");
      await this.createDialogBox(
        "Well… I've been running some calculations and I've found out that we are reaching a point of no return. If we keep going like this, temperatures will become unbearable. But we can stop it!"
      );
      await this.createDialogBox(
        "Here's a leaflet with more information. Thanks for your help!"
      );
      await this.createDialogBox("Nate: …yeah I'm doing great too.");
      this.talkToNeighbour();
      talkedTo = true;
    });
  }

  talkToNeighbour() {
    this.neighboursTalkedTo++;
    this.todos[2].text = `Spread the word by talking to 5 neighbours (${this.neighboursTalkedTo}/5)`;
    if (this.neighboursTalkedTo === 5) {
      this.todos[2].done;
    }
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

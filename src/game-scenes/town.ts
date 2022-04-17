import { CarSprite } from "../sprites/car";
import { BaseScene } from "../utils/BaseScene";

export class Town extends BaseScene {
  todos = [
    {
      id: "groceries",
      text: "Buy groceries while trying to reduce my carbon footprint",
      done: false,
    },
    {
      id: "sendLetter",
      text: "Send a letter to the president",
      done: false,
    },
    {
      id: "talk",
      text: "Spread the word by talking to 5 neighbours (0/5)",
      done: false,
    },
    {
      id: "garden",
      text: "Buy supplies to grow a self-consumption garden",
      done: false,
    },
  ];
  groceriesChosenOption: string;
  HUDmoney: Phaser.GameObjects.Text;
  HUDtime: Phaser.GameObjects.Text;
  car: CarSprite;
  isInCar = false;
  hasDrivenCar = false;
  timeLeft = 2 * 59 * 1000;
  neighboursTalkedTo = 0;
  money = 100;

  constructor() {
    super("town");
  }

  preload() {
    this.load.image("transparent", "/assets/sprites/transparent.png");
    this.load.image("abby", "/assets/sprites/abby.png");
    this.load.image("chloe", "/assets/sprites/chloe.png");
    this.load.image("ellie", "/assets/sprites/ellie.png");
    this.load.image("joel", "/assets/sprites/joel.png");
    this.load.image("nate", "/assets/sprites/nate.png");
    this.load.image("tiles", "/assets/tilemaps/town.png");
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/town.json");

    this.load.spritesheet("car", "./assets/sprites/car.png", {
      frameWidth: 74,
      frameHeight: 36,
    });
  }

  async create() {
    super.create();
    this.car = new CarSprite(this, 200, 200);
    this.cameras.main.setBounds(0, 0, 2432, 1856);
    const HUDbg = this.add.graphics({
      fillStyle: {
        color: 0x222222,
      },
    });
    HUDbg.fillRect(620, 0, 180, 35);
    HUDbg.setScrollFactor(0, 0);
    HUDbg.setDepth(100);

    this.HUDmoney = this.add.text(715, 0, `$ ${this.money}`, {
      fontFamily: "VT323, monospace",
      fontSize: "30px",
      padding: { y: 2 },
      color: "#d9f7ca",
    });
    this.HUDmoney.setScrollFactor(0, 0);
    this.HUDmoney.setDepth(100);
    this.HUDtime = this.add.text(640, 0, `${this.timeLeft}`, {
      fontFamily: "VT323, monospace",
      fontSize: "30px",
      padding: { y: 2 },
      color: "#d9f7ca",
    });
    this.HUDtime.setScrollFactor(0, 0);
    this.HUDtime.setDepth(100);

    const map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("town", "tiles");
    const layer = map.createLayer("ground", tileset, 0, 0);
    const buildings = map.createLayer("buildings", tileset, 0, 0);
    buildings.setCollisionByExclusion([-1], true);
    layer.setDepth(-1);

    this.setupGroceriesStore();
    this.setupPostalOffice();
    this.setupGardenCenter();

    this.setupNeighbourAbby();
    this.setupNeighbourChloe();
    this.setupNeighbourEllie();
    this.setupNeighbourJoel();
    this.setupNeighbourNate();

    this.physics.add.collider(this.player, this.car, async () => {
      if (this.isInCar) return;
      this.player.setDepth(-2);
      this.player.disableMovement();
      this.isInCar = true;
      this.cameras.main.startFollow(this.car);
      // await this.createDialogBox("Press X to get out of the car");
      // this.player.disableMovement();
      const textBg = this.add.graphics({
        fillStyle: {
          color: 0x222222,
        },
      });
      textBg.fillRect(0, 565, 800, 35);
      textBg.setScrollFactor(0, 0);
      textBg.setDepth(100);

      const text = this.add.text(255, 565, `Press X to leave the car`, {
        fontFamily: "VT323, monospace",
        fontSize: "30px",
        padding: { y: 2 },
        color: "#d9f7ca",
      });
      text.setScrollFactor(0, 0);
      text.setDepth(100);

      const listener = this.input.keyboard.on(
        "keydown",
        (ev: KeyboardEvent) => {
          if (ev.key.toLowerCase() === "x") {
            text.destroy();
            textBg.destroy();
            this.isInCar = false;

            this.player.setX(this.car.x);
            this.player.setY(this.car.y + 50);
            this.player.enableMovement();
            this.player.setDepth(0);
            this.cameras.main.startFollow(this.player);
            listener.removeListener("keydown");
          }
        }
      );
    });
    this.physics.add.collider(this.player, buildings);
    this.physics.add.collider(this.car, buildings);

    await this.createDialogBox(
      "Lots to do before the stores close! I don't have much time. I could drive but that doesn't help the planet…"
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.timeLeft -= delta;
    this.updateTime();

    if (this.isInCar) {
      if (this.cursors.left.isDown) {
        this.car.moveLeft();
        this.hasDrivenCar = true;
      } else if (this.cursors.right.isDown) {
        this.car.moveRight();
        this.hasDrivenCar = true;
      } else if (this.cursors.up.isDown) {
        this.car.moveUp();
        this.hasDrivenCar = true;
      } else if (this.cursors.down.isDown) {
        this.car.moveDown();
        this.hasDrivenCar = true;
      } else {
        this.car.moveStop();
      }
    }

    if (this.areTodosCompleted()) {
      this.gameOver();
    }
  }

  setupGroceriesStore() {
    const options = {
      1: 30,
      2: 40,
      3: 50,
    };

    const groceriesStore = this.physics.add.staticImage(
      1184,
      1438,
      "transparent"
    );
    groceriesStore.setBodySize(64, 64);

    this.physics.add.collider(this.player, groceriesStore, async () => {
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
          if (!this.hasEnoughMoney(options[key])) {
            this.closeInteractionBox();
            return await this.createDialogBox("I don't have enough money!");
          }
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
    const postalOffice = this.physics.add.staticImage(1632, 544, "transparent");
    postalOffice.setBodySize(64, 64);

    this.physics.add.collider(this.player, postalOffice, async () => {
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
          if (!this.hasEnoughMoney(10)) {
            this.closeInteractionBox();
            return await this.createDialogBox("I don't have enough money!");
          }
          this.decreaseMoney(10);
          this.todos[1].done = true;
          this.closeInteractionBox();
          return;
        }
        this.closeInteractionBox();
      });
    });
  }

  setupGardenCenter() {
    const gardenCenter = this.physics.add.staticImage(2240, 288, "transparent");
    gardenCenter.setBodySize(64, 64);

    this.physics.add.collider(this.player, gardenCenter, async () => {
      if (this.todos[3].done) {
        await this.createDialogBox(
          "I already have everything I need to grow my garden"
        );
        return;
      }
      await this.createInteractionBox(
        `Buy supplies to grow a self-consumption garden? It's $60 (Press Y to confirm)`
      );
      this.input.keyboard.once("keydown", async (ev: KeyboardEvent) => {
        const key = ev.key.toLowerCase();

        if (key === "y") {
          if (!this.hasEnoughMoney(60)) {
            this.closeInteractionBox();
            return await this.createDialogBox("I don't have enough money!");
          }
          this.decreaseMoney(60);
          this.todos[3].done = true;
          this.closeInteractionBox();
          return;
        }
        this.closeInteractionBox();
      });
    });
  }

  setupNeighbourAbby() {
    let talkedTo = false;
    const neighbour = this.physics.add.staticImage(1152, 448, "abby");

    this.physics.add.collider(this.car, neighbour);
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
    const neighbour = this.physics.add.staticImage(288, 1248, "chloe");

    this.physics.add.collider(this.car, neighbour);
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

    this.physics.add.collider(this.car, neighbour);
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
    const neighbour = this.physics.add.staticImage(1888, 1184, "ellie");

    this.physics.add.collider(this.car, neighbour);
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
    const neighbour = this.physics.add.staticImage(2336, 1760, "nate");
    neighbour.setFlipX(true);

    this.physics.add.collider(this.car, neighbour);
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
      this.todos[2].done = true;
    }
  }

  hasEnoughMoney(amount: number) {
    return this.money - amount >= 0;
  }

  decreaseMoney(amount: number) {
    this.money -= amount;
    this.HUDmoney.text = `$ ${this.money}`;
    this.HUDmoney.updateText();
  }

  updateTime() {
    const minutes = Math.floor(this.timeLeft / 60000);
    const seconds = (this.timeLeft % 60000) / 1000;
    const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds.toFixed(0)}`;
    const displayTime = `${minutes}:${displaySeconds}`;
    this.HUDtime.text = displayTime;
    this.HUDtime.updateText();

    if (this.timeLeft <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.scene.start("game-over", {
      todos: this.todos,
      groceriesChosenOption: this.groceriesChosenOption,
      hasDrivenCar: this.hasDrivenCar,
    });
  }
}

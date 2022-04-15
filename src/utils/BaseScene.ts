import { PlayerSprite } from "../sprites/player";
import { DialogService } from "./Dialog";
import { ToDoList } from "./ToDoList";

export class BaseScene extends Phaser.Scene {
  dialog: DialogService;
  toDoList: ToDoList;
  todos: {
    id: string;
    text: string;
    done: boolean;
  }[];
  player: PlayerSprite;
  enableControls = true;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {}

  create() {
    this.dialog = new DialogService(this);
    this.player = new PlayerSprite(this, 350, 200);
    this.toDoList = new ToDoList(this, this.todos);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 10000, 10000);
    this.cameras.main.startFollow(this.player, false);

    this.input.keyboard.on("keydown", (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === "t") {
        ev.stopImmediatePropagation();
        if (!this.enableControls) return;
        ev.preventDefault();
        this.toggleToDoList();
      }
    });
  }

  update(time: number, delta: number): void {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else if (this.cursors.up.isDown) {
      this.player.moveUp();
    } else if (this.cursors.down.isDown) {
      this.player.moveDown();
    } else {
      this.player.moveStop();
    }
  }

  async createDialogBox(text: string) {
    this.player.disableMovement();
    return this.dialog
      .createDialogBox(text)
      .then(() => this.player.enableMovement());
  }

  async createInteractionBox(text: string) {
    this.player.disableMovement();
    return this.dialog.createDialogBox(text, false);
  }

  closeInteractionBox() {
    this.dialog.toggleWindow();
    this.player.enableMovement();
  }

  toggleToDoList() {
    if (!this.dialog.isVisible) {
      this.player.toggleMovement();
      return this.toDoList.toggle();
    }
  }
}

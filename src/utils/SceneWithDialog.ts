import { DialogService } from "./Dialog";

export abstract class SceneWithDialog extends Phaser.Scene {
  dialog: DialogService;
}

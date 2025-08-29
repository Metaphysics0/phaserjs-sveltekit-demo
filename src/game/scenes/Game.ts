import { Scene } from "phaser";
import { loadAssets } from "../asset-loader";

export class Game extends Scene {
  player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms?: Phaser.Physics.Arcade.StaticGroup;
  constructor() {
    super("Game");
  }

  preload() {
    loadAssets(this.load);
  }

  create() {
    this.add.image(400, 300, "sky");
    this.platforms = this.createPlatforms();
    this.player = this.createPlayer();

    this.physics.add.collider(this.player, this.platforms);
  }

  update() {
    this.createKeyboardInput();
  }

  private createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    return platforms;
  }

  private createPlayer() {
    const player = this.physics.add.sprite(100, 450, "dude");
    player.setGravityY(300);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  private createKeyboardInput() {
    const cursors = this.input.keyboard?.createCursorKeys();
    if (!cursors) return;
    if (!this.player) {
      console.warn("[createKeyboardInput] - Player not loaded yet");
      return;
    }

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-440);
    }
  }
}

import { Scene } from "phaser";
import { loadAssets } from "../asset-loader";

type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type Platforms = Phaser.Physics.Arcade.StaticGroup;
type Stars = Phaser.Physics.Arcade.Group;
export class Game extends Scene {
  player!: Player;
  platforms!: Platforms;
  stars!: Stars;
  bombs!: Phaser.Physics.Arcade.Group;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  enterKey!: Phaser.Input.Keyboard.Key;

  score = 0;
  scoreText!: Phaser.GameObjects.Text;

  gameOver: boolean = false;
  gameOverText!: Phaser.GameObjects.Text;
  touchInput = {
    left: false,
    right: false,
    up: false,
  };

  leftButton?: Phaser.GameObjects.GameObject;
  rightButton?: Phaser.GameObjects.GameObject;
  upButton?: Phaser.GameObjects.GameObject;

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
    this.stars = this.createStars();
    this.bombs = this.physics.add.group();
    this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px" });
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    );
    this.createTouchControls();
  }

  update() {
    this.handleInput();
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
  private hitBomb = () => {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.gameOver = true;
    this.displayGameOverDialogue();
  };

  private displayGameOverDialogue() {
    const container = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );
    const bg = this.add.graphics();
    bg.fillStyle(0xd2b48c); // Tan color
    bg.fillRoundedRect(-150, -100, 300, 200, 20);

    const text = this.add
      .text(0, -30, "Game Over", { fontSize: "32px", color: "#ffffff" })
      .setOrigin(0.5);

    const playAgainButton = this.add
      .text(0, 30, "Play Again", {
        fontSize: "24px",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.restartGame());

    container.add([bg, text, playAgainButton]);
  }

  private restartGame() {
    this.scene.restart();
  }

  private createStars() {
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate((child) => {
      // @ts-ignore
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return null;
    });
    return stars;
  }

  private collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _obj1,
    obj2
  ) => {
    const star = obj2 as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
        const s = child as Phaser.Physics.Arcade.Image;
        s.enableBody(true, s.x, 0, true, true);
        return null;
      });

      const x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(
        x,
        16,
        "bomb"
      ) as Phaser.Physics.Arcade.Image;
      bomb
        .setBounce(1)
        .setCollideWorldBounds(true)
        .setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  };

  private handleInput() {
    if (this.gameOver && this.enterKey.isDown) {
      this.restartGame();
      return;
    }

    // Check both keyboard and touch input
    const leftPressed = this.cursors.left.isDown || this.touchInput.left;
    const rightPressed = this.cursors.right.isDown || this.touchInput.right;
    const upPressed = this.cursors.up.isDown || this.touchInput.up;

    if (leftPressed) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (rightPressed) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (upPressed && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }

  private createTouchControls() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const buttonSize = 60;
    const margin = 30;
    const opacity = 0.4;

    // Position buttons in bottom-right corner
    const rightX = gameWidth - margin - buttonSize / 2;
    const leftX = gameWidth - margin - buttonSize / 2 - buttonSize - 10;
    const upX = gameWidth - margin - buttonSize / 2;
    const bottomY = gameHeight - margin - buttonSize / 2;
    const upY = gameHeight - margin - buttonSize / 2 - buttonSize - 10;

    // Left arrow button
    this.leftButton = this.add
      .text(leftX, bottomY, "←", {
        fontSize: "40px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setAlpha(opacity)
      .setInteractive()
      .on("pointerdown", () => (this.touchInput.left = true))
      .on("pointerup", () => (this.touchInput.left = false))
      .on("pointerout", () => (this.touchInput.left = false));

    // Right arrow button
    this.rightButton = this.add
      .text(rightX, bottomY, "→", {
        fontSize: "40px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setAlpha(opacity)
      .setInteractive()
      .on("pointerdown", () => (this.touchInput.right = true))
      .on("pointerup", () => (this.touchInput.right = false))
      .on("pointerout", () => (this.touchInput.right = false));

    // Up arrow button
    this.upButton = this.add
      .text(upX, upY, "↑", {
        fontSize: "40px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setAlpha(opacity)
      .setInteractive()
      .on("pointerdown", () => (this.touchInput.up = true))
      .on("pointerup", () => (this.touchInput.up = false))
      .on("pointerout", () => (this.touchInput.up = false));
  }
}

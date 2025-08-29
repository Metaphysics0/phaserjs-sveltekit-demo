import { Scene } from "phaser";
import { loadAssets } from "../asset-loader";

type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type Platforms = Phaser.Physics.Arcade.StaticGroup;
type Stars = Phaser.Physics.Arcade.Group;
export class Game extends Scene {
  player?: Player;
  platforms?: Platforms;
  stars?: Stars;

  score: number = 0;
  scoreText?: Phaser.GameObjects.Text;

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
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    );
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

  private collectStar(player: any, star: any) {
    star.disableBody(true, true);
    this.score += 10;
    if (!this.scoreText) return;
    this.scoreText.setText("Score: " + this.score);
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

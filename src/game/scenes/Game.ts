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

  score = 0;
  scoreText!: Phaser.GameObjects.Text;

  gameOver: boolean = false;

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
  };

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
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }
}

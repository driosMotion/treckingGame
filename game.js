/* ======================================
 *  treckingGame — Phaser 3
 *  Mobile-web 2D pixel platformer
 *  Inspired by Super Mario Bros 3
 * ====================================== */

const W = 400;  // game width (pixels)
const H = 240;  // game height (pixels)
const TILE = 16; // base tile size

// ── Boot Scene — generate pixel-art textures ──
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    // --- climber spritesheet (32x48, 4 frames) ---
    this.generateClimber();
    // --- ground/terrain tiles (16x16) ---
    this.generateTiles();
    // --- parallax backgrounds ---
    this.generateBackgrounds();
    // --- coin / collectible ---
    this.generateCoin();
    // --- UI controls ---
    this.generateUI();

    this.scene.start('Menu');
  }

  /* Pixel-art climber: graphics-based generation (works with WebGL) */
  generateClimber() {
    const F = 32, Hf = 48;

    for (let f = 0; f < 4; f++) {
      const g = this.make.graphics({ add: false });

      // Beanie (red)
      g.fillStyle(0xcc4422);
      g.fillRect(8, 1, 16, 8);

      // Head/face (skin)
      g.fillStyle(0xf5d0a9);
      g.fillRect(10, 9, 12, 9);

      // Eyes (black dots)
      g.fillStyle(0x222222);
      g.fillRect(12, 12, 2, 2);
      g.fillRect(18, 12, 2, 2);

      // Body/jacket (blue)
      g.fillStyle(0x3366cc);
      g.fillRect(8, 18, 16, 12);

      // Arms (blue)
      g.fillRect(4, 19, 4, 10);
      g.fillRect(24, 19, 4, 10);

      // Pants (red) - vary by frame
      g.fillStyle(0xcc3333);
      if (f === 0) {
        g.fillRect(10, 30, 5, 12);
        g.fillRect(17, 30, 5, 12);
      } else if (f === 1) {
        g.fillRect(8, 30, 5, 10);
        g.fillRect(19, 30, 5, 14);
      } else if (f === 2) {
        g.fillRect(9, 30, 5, 14);
        g.fillRect(18, 30, 5, 10);
      } else {
        g.fillRect(9, 30, 5, 6);
        g.fillRect(10, 36, 3, 6);
        g.fillRect(18, 30, 5, 6);
        g.fillRect(19, 36, 3, 6);
      }

      // Boots (brown)
      g.fillStyle(0x4a2800);
      if (f === 0) {
        g.fillRect(9, 42, 6, 4);
        g.fillRect(17, 42, 6, 4);
      } else if (f === 1) {
        g.fillRect(7, 40, 6, 4);
        g.fillRect(18, 44, 6, 4);
      } else if (f === 2) {
        g.fillRect(8, 44, 6, 4);
        g.fillRect(17, 40, 6, 4);
      } else {
        g.fillRect(9, 40, 6, 4);
        g.fillRect(17, 40, 6, 4);
      }

      // Dark outline
      g.lineStyle(1, 0x222222, 1);
      g.strokeRect(1, 1, F - 2, Hf - 2);

      // Generate texture (THIS works in WebGL, unlike createCanvas)
      g.generateTexture('climber_' + f, F, Hf);
      g.destroy();
    }
  }

  generateTiles() {
    // Generate simple 16x16 terrain tiles
    // Tile 0: grass top (green top, brown dirt)
    // Tile 1: dirt (brown)
    // Tile 2: stone (grey)
    // Tile 3: snow top (white top, grey stone)

    const g = this.make.graphics({ add: false });
    const sz = 16;

    // grass top
    g.clear();
    g.fillStyle(0x5a8a3a); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0x8b5e3c); g.fillRect(0, 6, sz, 10);
    g.fillStyle(0x4a7a2a);
    for (let x = 0; x < sz; x += 4) { g.fillRect(x, 5, 2, 1); }
    g.generateTexture('tile_grass', sz, sz);

    // dirt
    g.clear();
    g.fillStyle(0x8b5e3c); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0x7a4e2c);
    for (let y = 0; y < sz; y += 4) {
      for (let x = 0; x < sz; x += 8) { g.fillRect(x, y, 2, 2); }
    }
    g.generateTexture('tile_dirt', sz, sz);

    // stone
    g.clear();
    g.fillStyle(0x6a6a6a); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0x7a7a7a);
    for (let y = 0; y < sz; y += 8) {
      g.fillRect(0, y, 4, 2);
      g.fillRect(8, y + 4, 4, 2);
    }
    g.generateTexture('tile_stone', sz, sz);

    // snow top
    g.clear();
    g.fillStyle(0xeeeeff); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0xccccdd); g.fillRect(0, 10, sz, 6);
    g.generateTexture('tile_snow', sz, sz);

    // tree trunk
    g.clear();
    g.fillStyle(0x5a3a1a); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0x4a2a0a);
    g.fillRect(3, 0, 2, sz); g.fillRect(11, 0, 2, sz);
    g.generateTexture('tile_trunk', sz, sz);

    // tree leaves
    g.clear();
    g.fillStyle(0x3a7a2a); g.fillRect(0, 0, sz, sz);
    g.fillStyle(0x4a8a3a);
    g.fillRect(2, 2, 12, 4); g.fillRect(4, 8, 8, 4);
    g.generateTexture('tile_leaves', sz, sz);

    g.destroy();
  }

  generateBackgrounds() {
    const g = this.make.graphics({ add: false });

    // Sky gradient (top to bottom)
    g.clear();
    for (let y = 0; y < H; y++) {
      const t = y / H;
      const r = Math.floor(100 + t * 60);
      const gr = Math.floor(150 + t * 40);
      const b = Math.floor(200 + t * 55);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b));
      g.fillRect(0, y, W, 1);
    }
    // Add some clouds
    g.fillStyle(0xffffff);
    g.fillRect(40, 30, 60, 12);
    g.fillRect(50, 22, 40, 8);
    g.fillRect(180, 50, 50, 10);
    g.fillRect(190, 44, 30, 6);
    g.fillRect(300, 25, 70, 14);
    g.fillRect(320, 19, 40, 6);
    g.generateTexture('bg_sky', W, H);

    // Far mountains (silhouette)
    g.clear();
    g.fillStyle(0x8877aa);
    // mountain peaks
    const peaks = [
      [0, 0], [20, -90], [50, -40], [90, -100], [130, -20],
      [170, -110], [210, -30], [250, -95], [290, -45], [330, -85],
      [370, -25], [400, -70]
    ];
    g.beginPath(); g.moveTo(0, H);
    for (const [x, top] of peaks) {
      g.lineTo(x, H + top);
    }
    g.lineTo(W, H); g.closePath();
    g.fillPath();
    g.generateTexture('bg_mountains_far', W, H);

    // Near mountains (darker, more detail)
    g.clear();
    g.fillStyle(0x556644);
    const peaks2 = [
      [0, -20], [30, -70], [70, -30], [110, -80], [150, -10],
      [190, -90], [230, -50], [270, -75], [310, -20], [350, -60],
      [400, -30]
    ];
    g.beginPath(); g.moveTo(0, H);
    for (const [x, top] of peaks2) {
      g.lineTo(x, H + top);
    }
    g.lineTo(W, H); g.closePath();
    g.fillPath();
    // Snow caps
    g.fillStyle(0xeeeedd);
    g.fillRect(28, H - 72, 6, 4); g.fillRect(108, H - 82, 6, 4);
    g.fillRect(188, H - 92, 8, 4); g.fillRect(268, H - 77, 6, 4);
    g.fillRect(348, H - 62, 6, 4);
    g.generateTexture('bg_mountains_near', W, H);

    g.destroy();
  }

  generateCoin() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffcc00);
    g.fillCircle(8, 8, 7);
    g.fillStyle(0xffdd44);
    g.fillCircle(8, 8, 4);
    g.fillStyle(0xeeaa00);
    g.fillRect(4, 6, 8, 4);
    g.generateTexture('coin', 16, 16);
    g.destroy();
  }

  generateUI() {
    // Mobile button textures
    const g = this.make.graphics({ add: false });
    // Left arrow
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRect(8, 4, 4, 20);
    g.fillRect(4, 8, 4, 12);
    g.fillTriangle(4, 14, 16, 2, 16, 26);
    g.generateTexture('btn_left', 28, 28);

    // Right arrow
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRect(8, 4, 4, 20);
    g.fillRect(20, 8, 4, 12);
    g.fillTriangle(24, 14, 12, 2, 12, 26);
    g.generateTexture('btn_right', 28, 28);

    // Jump button (A)
    g.clear();
    g.fillStyle(0xff4444);
    g.fillCircle(16, 16, 15);
    g.fillStyle(0xffffff);
    g.fillRect(10, 10, 12, 12);
    g.generateTexture('btn_jump', 32, 32);

    g.destroy();
  }
}

// ── Menu Scene ──
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    this.add.text(W / 2, 50, 'T R E C K I N G\n  G A M E', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffffff',
      align: 'center', lineSpacing: 4
    }).setOrigin(0.5);

    // Pixel art mountain icon
    this.add.image(W / 2, 120, 'bg_mountains_far').setAlpha(0.5).setScale(0.8);

    // Subtitle
    this.add.text(W / 2, 170, 'Conquer the peaks!', {
      fontSize: '8px', fontFamily: 'monospace', color: '#aaaacc'
    }).setOrigin(0.5);

    // Start prompt
    const startText = this.add.text(W / 2, 200, 'TAP or PRESS SPACE', {
      fontSize: '9px', fontFamily: 'monospace', color: '#ffff44'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText, alpha: 0.3, duration: 600,
      yoyo: true, repeat: -1
    });

    // Credits
    this.add.text(W / 2, 230, 'a hermes project', {
      fontSize: '6px', fontFamily: 'monospace', color: '#555566'
    }).setOrigin(0.5);

    // Input
    this.input.once('pointerdown', () => this.scene.start('Game'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
  }
}

// ── Game Scene ──
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.cameras.main.setBackgroundColor('#5c94fc');

    // ── World bounds ──
    this.worldW = 6400;
    this.worldH = 480;
    this.physics.world.setBounds(0, 0, this.worldW, this.worldH);

    // ── Parallax backgrounds (lowest depths so player renders on top) ──
    // Sky as plain image (no tiling needed)
    this.bgSky = this.add.image(W/2, H/2, 'bg_sky')
      .setScrollFactor(0).setDepth(-20);
    this.bgFar = this.add.tileSprite(0, 0, W, H, 'bg_mountains_far')
      .setOrigin(0, 0).setScrollFactor(0).setAlpha(0.6).setDepth(-10);
    this.bgNear = this.add.tileSprite(0, 0, W, H, 'bg_mountains_near')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-5);

    // ── Build level from tilemap data ──
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.staticGroup();
    this.buildLevel(this.worldW);

    // ── Player ──
    this.player = this.physics.add.sprite(64, 200, 'climber_0');
    this.player.setSize(20, 44);
    this.player.setOffset(6, 4);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(120, 400);
    this.player.body.setGravityY(800);
    this.player.setDepth(50);

    // Animations (individual textures per frame)
    this.anims.create({
      key: 'idle', frames: [{ key: 'climber_0' }],
      frameRate: 1, repeat: -1
    });
    this.anims.create({
      key: 'run', frames: [
        { key: 'climber_1' },
        { key: 'climber_0' },
        { key: 'climber_2' },
        { key: 'climber_0' },
      ],
      frameRate: 8, repeat: -1
    });
    this.anims.create({
      key: 'jump', frames: [{ key: 'climber_3' }],
      frameRate: 1, repeat: 0
    });

    // ── Collisions ──
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // ── Camera ──
    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ── Input ──
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── Mobile touch controls ──
    this.createTouchControls();

    // ── HUD ──
    this.coinCount = 0;
    this.coinText = this.add.text(8, 8, '⛰ 0', {
      fontSize: '10px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setScrollFactor(0).setDepth(100);

    // ── Game over / win flag ──
    this.finishLine = this.add.rectangle(this.worldW - 80, 400, 20, 120, 0xffdd00)
      .setOrigin(0.5, 0.5);
    this.physics.add.existing(this.finishLine, true);
    this.physics.add.overlap(this.player, this.finishLine, this.winLevel, null, this);

    // Win flag text
    this.add.text(this.worldW - 80, 340, '🏁', {
      fontSize: '16px'
    }).setOrigin(0.5);
  }

  buildLevel(worldW) {
    // Simple level generator: platforms + gaps + coins
    const rows = [
      // ground: solid for first section, then varied
      { y: 448, w: 1200, tile: 'tile_grass' },
      { y: 448, x: 1400, w: 400, tile: 'tile_grass' },     // gap
      { y: 448, x: 2000, w: 600, tile: 'tile_snow' },       // snow section
      { y: 448, x: 2800, w: 400, tile: 'tile_grass' },
      { y: 448, x: 3400, w: 800, tile: 'tile_stone' },      // stone section
      { y: 448, x: 4400, w: 600, tile: 'tile_snow' },
      { y: 448, x: 5200, w: worldW - 5200, tile: 'tile_grass' },

      // raised platforms
      { y: 368, x: 200, w: 96, tile: 'tile_dirt' },
      { y: 368, x: 500, w: 128, tile: 'tile_dirt' },
      { y: 288, x: 700, w: 64, tile: 'tile_dirt' },
      { y: 368, x: 900, w: 128, tile: 'tile_dirt' },

      // snow platforms
      { y: 320, x: 1500, w: 128, tile: 'tile_snow' },
      { y: 240, x: 1700, w: 128, tile: 'tile_snow' },
      { y: 320, x: 2200, w: 128, tile: 'tile_snow' },

      // stone steps
      { y: 400, x: 3000, w: 64, tile: 'tile_stone' },
      { y: 352, x: 3080, w: 64, tile: 'tile_stone' },
      { y: 304, x: 3160, w: 64, tile: 'tile_stone' },
      { y: 256, x: 3240, w: 64, tile: 'tile_stone' },

      // floating platforms with coins
      { y: 304, x: 3600, w: 128, tile: 'tile_dirt' },
      { y: 240, x: 3900, w: 128, tile: 'tile_dirt' },
      { y: 304, x: 4200, w: 128, tile: 'tile_dirt' },

      // final steps (ascending to flag)
      { y: 400, x: 4700, w: 64, tile: 'tile_snow' },
      { y: 352, x: 4780, w: 64, tile: 'tile_snow' },
      { y: 304, x: 4860, w: 64, tile: 'tile_snow' },
      { y: 256, x: 4940, w: 64, tile: 'tile_snow' },

      // more platforms near end
      { y: 368, x: 5400, w: 96, tile: 'tile_dirt' },
      { y: 288, x: 5600, w: 96, tile: 'tile_dirt' },
      { y: 208, x: 5800, w: 64, tile: 'tile_dirt' },
    ];

    for (const row of rows) {
      const tx = row.x || 0;
      const tiles = Math.floor(row.w / 16);
      for (let i = 0; i < tiles; i++) {
        const tile = this.platforms.create(tx + i * 16 + 8, row.y + 8, row.tile);
        tile.setOrigin(0.5, 0.5);
        tile.refreshBody();
      }
    }

    // Decorative trees
    const trees = [
      { x: 100, y: 416 }, { x: 350, y: 416 },
      { x: 650, y: 416 }, { x: 1050, y: 416 },
    ];
    for (const t of trees) {
      this.add.image(t.x, t.y - 32, 'tile_trunk').setScale(1, 3).setDepth(-1);
      this.add.image(t.x, t.y - 48, 'tile_leaves').setScale(2, 2).setDepth(-1);
      this.add.image(t.x, t.y - 64, 'tile_leaves').setScale(1.5, 1.5).setDepth(-1);
    }

    // Coins
    const coinPositions = [
      { x: 250, y: 352 }, { x: 266, y: 352 }, { x: 282, y: 352 },
      { x: 540, y: 352 }, { x: 556, y: 352 },
      { x: 740, y: 272 },
      { x: 940, y: 352 }, { x: 956, y: 352 },
      { x: 1550, y: 304 }, { x: 1566, y: 304 },
      { x: 1740, y: 224 }, { x: 1756, y: 224 },
      { x: 2250, y: 304 }, { x: 2266, y: 304 },
      { x: 3030, y: 384 }, { x: 3046, y: 384 },
      { x: 3110, y: 336 }, { x: 3126, y: 336 },
      { x: 3190, y: 288 }, { x: 3206, y: 288 },
      { x: 3640, y: 288 }, { x: 3656, y: 288 }, { x: 3672, y: 288 },
      { x: 3940, y: 224 }, { x: 3956, y: 224 },
      { x: 4240, y: 288 }, { x: 4256, y: 288 },
      { x: 5440, y: 352 }, { x: 5456, y: 352 },
      { x: 5640, y: 272 }, { x: 5656, y: 272 },
      { x: 5840, y: 192 }, { x: 5856, y: 192 },
    ];
    for (const c of coinPositions) {
      const coin = this.coins.create(c.x, c.y, 'coin');
      coin.refreshBody();

      // Coin hover animation
      this.tweens.add({
        targets: coin, y: c.y - 4, duration: 500,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }
  }

  createTouchControls() {
    // Semi-transparent touch zone overlay
    const margin = 4;

    // Left button
    this.btnLeft = this.add.image(margin + 14, H - 28 - margin, 'btn_left')
      .setScrollFactor(0).setAlpha(0.5).setInteractive().setDepth(200);
    this.btnLeft.on('pointerdown', () => { this._leftDown = true; });
    this.btnLeft.on('pointerup', () => { this._leftDown = false; });
    this.btnLeft.on('pointerout', () => { this._leftDown = false; });

    // Right button
    this.btnRight = this.add.image(margin + 50, H - 28 - margin, 'btn_right')
      .setScrollFactor(0).setAlpha(0.5).setInteractive().setDepth(200);
    this.btnRight.on('pointerdown', () => { this._rightDown = true; });
    this.btnRight.on('pointerup', () => { this._rightDown = false; });
    this.btnRight.on('pointerout', () => { this._rightDown = false; });

    // Jump button (right side)
    this.btnJump = this.add.image(W - margin - 16, H - 28 - margin, 'btn_jump')
      .setScrollFactor(0).setAlpha(0.5).setInteractive().setDepth(200);
    this.btnJump.on('pointerdown', () => { this._jumpDown = true; });
    this.btnJump.on('pointerup', () => { this._jumpDown = false; });
    this.btnJump.on('pointerout', () => { this._jumpDown = false; });

    // Prevent default on touch
    this.input.on('pointerdown', (p) => { p.event.preventDefault(); });
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.coinCount++;
    this.coinText.setText('⛰ ' + this.coinCount);

    // Sound effect placeholder (visual flash)
    this.cameras.main.flash(80, 255, 255, 200);
  }

  winLevel() {
    // Freeze player
    this.player.body.setVelocity(0, 0);
    this.player.body.setAllowGravity(false);

    const winText = this.add.text(W / 2, H / 2 - 20, '🏔 PEAK REACHED! 🏔', {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffff44',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    const scoreText = this.add.text(W / 2, H / 2 + 10, 'Coins: ' + this.coinCount, {
      fontSize: '8px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    const restartText = this.add.text(W / 2, H / 2 + 40, 'TAP to restart', {
      fontSize: '7px', fontFamily: 'monospace', color: '#aaaaaa'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    this.tweens.add({
      targets: [winText, scoreText, restartText],
      alpha: 0, duration: 8000,
      onComplete: () => this.scene.restart()
    });

    this.input.once('pointerdown', () => this.scene.start('Menu'));
  }

  update() {
    if (!this.player || !this.player.body) return;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const speed = 100;

    // ── Horizontal movement ──
    let moveX = 0;
    if (this.cursors.left.isDown || this._leftDown) moveX = -1;
    else if (this.cursors.right.isDown || this._rightDown) moveX = 1;

    this.player.setVelocityX(moveX * speed);

    // Flip sprite based on direction
    if (moveX < 0) this.player.setFlipX(true);
    else if (moveX > 0) this.player.setFlipX(false);

    // ── Jump ──
    if ((this.cursors.up.isDown || this.spaceKey.isDown || this._jumpDown) && onGround) {
      this.player.setVelocityY(-280);
      this._jumpDown = false; // prevent holding jump
    }

    // ── Animation ──
    if (!onGround) {
      this.player.play('jump', true);
    } else if (moveX !== 0) {
      this.player.play('run', true);
    } else {
      this.player.play('idle', true);
    }

    // ── Parallax scrolling (mountains only, sky is static) ──
    const camX = this.cameras.main.scrollX;
    this.bgFar.tilePositionX = camX * 0.15;
    this.bgNear.tilePositionX = camX * 0.3;

    // ── Fall death ──
    if (this.player.y > this.worldH + 50) {
      this.scene.restart();
    }
  }
}

// ── Phaser Config ──
const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: document.body,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
  scene: [BootScene, MenuScene, GameScene],
};

var game = new Phaser.Game(config);

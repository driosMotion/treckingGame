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

  /* Pixel-art climber: brown hair, blue shirt, red pants */
  generateClimber() {
    const gw = this.make.graphics({ add: false });
    const F = 32, Hf = 48;
    const colors = {
      skin: 0xf5d0a9,  hair: 0x6b3a2a, shirt: 0x3366cc,
      pants: 0xcc3333, shoe: 0x4a2800, eye: 0x222222,
      outline: 0x222222,
    };

    function px(g, x, y, color) { g.fillStyle(color); g.fillRect(x, y, 1, 1); }

    // Frame 0: idle (stand)
    // Frame 1: run 1 (right leg forward)
    // Frame 2: run 2 (left leg forward)
    // Frame 3: jump (arms up)

    const frames = [
      // frame 0 — idle
      [
        // hair (3 rows)
        '..xxxxx....', '..xxxxxxx..', '..xxxxxxxx.',
        // face
        '.xxxxxxxxx.', '.xx.x.xxxx.', '.xxxxxxxxx.',
        // body
        '.xxxxxxxxx.', '.xxxxxxxxx.', '..xxxxxxx..',
        // arms + belt
        'xxxxxxxxxxx', 'xxxxxxxxxxx', '..xxxxxxx..',
        // legs
        '..x...x...', '..xx.xx...', '..xx.xx...',
        // shoes
        '..xxx.xxx.',
      ],
      // frame 1 — run right leg forward
      [
        '..xxxxx....', '..xxxxxxx..', '..xxxxxxxx.',
        '.xxxxxxxxx.', '.xx.x.xxxx.', '.xxxxxxxxx.',
        '.xxxxxxxxx.', '.xxxxxxxxx.', '..xxxxxxx..',
        'xxxxxxxxxxx', 'xxxxxxxxxxx', '..xxxxxxx..',
        '..x...x..', '..xx.xx..', '..xx.xx..',
        '..xxx..xxx',
      ],
      // frame 2 — run left leg forward
      [
        '..xxxxx....', '..xxxxxxx..', '..xxxxxxxx.',
        '.xxxxxxxxx.', '.xx.x.xxxx.', '.xxxxxxxxx.',
        '.xxxxxxxxx.', '.xxxxxxxxx.', '..xxxxxxx..',
        'xxxxxxxxxxx', 'xxxxxxxxxxx', '..xxxxxxx..',
        '..x...x..', '...xx.xx.', '...xx.xx.',
        '..xxx..xxx',
      ],
      // frame 3 — jump (arms up)
      [
        '..xxxxx....', '..xxxxxxx..', '..xxxxxxxx.',
        '.xxxxxxxxx.', '.xx.x.xxxx.', '.xxxxxxxxx.',
        '.xxxxxxxxx.', '.xxxxxxxxx.', '..xxxxxxx..',
        'xxxxxxxxxxx', '..xxxxxxx..', '..xxxxxxx..',
        '..x...x..', '..xx.xx..', '..xx.xx..',
        '..xxx.xxx.',
      ],
    ];

    // Actually let me just draw proper pixel art programmatically

    const texData = [];
    for (let f = 0; f < 4; f++) {
      gw.clear();
      this.drawClimberFrame(gw, f, colors);
      gw.generateTexture('climber_' + f, F, Hf);
      texData.push(gw);
    }

    // Build spritesheet manually: draw all frames into one canvas
    const canvas = this.textures.createCanvas('climber_sheet', F * 4, Hf);
    const ctx = canvas.context;
    for (let f = 0; f < 4; f++) {
      const src = this.textures.get('climber_' + f).getSourceImage();
      ctx.drawImage(src, f * F, 0);
    }
    canvas.refresh();

    // Add spritesheet frames
    this.textures.get('climber_sheet').add(0, 0, 0, 0, F, Hf);
    this.textures.get('climber_sheet').add(1, 0, F, 0, F, Hf);
    this.textures.get('climber_sheet').add(2, 0, F * 2, 0, F, Hf);
    this.textures.get('climber_sheet').add(3, 0, F * 3, 0, F, Hf);

    // Cleanup temp textures
    for (let f = 0; f < 4; f++) this.textures.remove('climber_' + f);
  }

  drawClimberFrame(g, frame, c) {
    g.fillStyle(c.outline);

    // Helper to draw a row at given y
    const rows = [
      // y0: hair top
      { y: 0,  pat: '..XXXXX....', col: c.hair },
      { y: 1,  pat: '..XXXXXXXX..', col: c.hair },
      { y: 2,  pat: '..XXXXXXXXX.', col: c.hair },
      // y3-6: face
      { y: 3,  pat: '.XXXXXXXXX.', col: c.skin },
      { y: 4,  pat: '.XX.X.XXXX.', col: c.skin }, // eyes
      { y: 5,  pat: '.XXXXXXXXX.', col: c.skin },
      { y: 6,  pat: '.XXXXXXXXX.', col: c.skin },
      // y7-9: shirt
      { y: 7,  pat: '.XXXXXXXXX.', col: c.shirt },
      { y: 8,  pat: 'XXXXXXXXXXX', col: c.shirt },
      { y: 9,  pat: 'XXXXXXXXXXX', col: c.shirt },
      // y10: belt
      { y: 10, pat: '..XXXXXXX..', col: c.pants },
      // y11-13: legs (varies by frame)
      { y: 11, pat: '..X...X..', col: c.pants },
      { y: 12, pat: '..XX.XX..', col: c.pants },
      { y: 13, pat: '..XX.XX..', col: c.pants },
      // y14: shoes
      { y: 14, pat: '..XXX.XXX.', col: c.shoe },
    ];

    // Override legs based on frame
    let lRows = rows.slice();
    if (frame === 1) { // run 1 — right forward
      lRows[11] = { y: 11, pat: '..X...X..', col: c.pants };
      lRows[12] = { y: 12, pat: '..XX.XX..', col: c.pants };
      lRows[13] = { y: 13, pat: '..XX.XX..', col: c.pants };
      lRows[14] = { y: 14, pat: '..XXX..XXX', col: c.shoe };
    } else if (frame === 2) { // run 2 — left forward
      lRows[11] = { y: 11, pat: '..X...X..', col: c.pants };
      lRows[12] = { y: 12, pat: '...XX.XX.', col: c.pants };
      lRows[13] = { y: 13, pat: '...XX.XX.', col: c.pants };
      lRows[14] = { y: 14, pat: '..XXX..XXX', col: c.shoe };
    } else if (frame === 3) { // jump — arms up
      lRows[8]  = { y: 8,  pat: 'XXXXXXXXXXX', col: c.shirt };
      lRows[9]  = { y: 9,  pat: '..XXXXXXX..', col: c.shirt };
      lRows[11] = { y: 11, pat: '..X...X..', col: c.pants };
      lRows[12] = { y: 12, pat: '..XX.XX..', col: c.pants };
      lRows[13] = { y: 13, pat: '..XX.XX..', col: c.pants };
      lRows[14] = { y: 14, pat: '..XXX.XXX.', col: c.shoe };
    }

    for (const row of lRows) {
      for (let x = 0; x < row.pat.length; x++) {
        if (row.pat[x] !== '.') {
          g.fillStyle(row.col);
          g.fillRect(x + 10, row.y, 1, 1);
          // outline
          g.fillStyle(c.outline);
        }
      }
    }
    // Draw eyes specifically (black dots)
    if (frame < 3) {
      g.fillStyle(c.eye);
      g.fillRect(13, 4, 1, 1);
      g.fillRect(18, 4, 1, 1);
    } else {
      // Jump frame eyes
      g.fillStyle(c.eye);
      g.fillRect(13, 4, 1, 1);
      g.fillRect(18, 4, 1, 1);
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
    const WORLD_W = 6400;
    const WORLD_H = 480;
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // ── Parallax backgrounds ──
    this.bgSky = this.add.tileSprite(0, 0, W, H, 'bg_sky').setOrigin(0, 0).setScrollFactor(0);
    this.bgFar = this.add.tileSprite(0, 0, W, H, 'bg_mountains_far')
      .setOrigin(0, 0).setScrollFactor(0).setAlpha(0.6);
    this.bgNear = this.add.tileSprite(0, 0, W, H, 'bg_mountains_near')
      .setOrigin(0, 0).setScrollFactor(0);

    // ── Build level from tilemap data ──
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.staticGroup();
    this.buildLevel(WORLD_W);

    // ── Player ──
    this.player = this.physics.add.sprite(64, 200, 'climber_sheet', 0);
    this.player.setSize(20, 44);
    this.player.setOffset(6, 4);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(120, 400);
    this.player.body.setGravityY(800);

    // Animations
    this.anims.create({
      key: 'idle', frames: [{ key: 'climber_sheet', frame: 0 }],
      frameRate: 1, repeat: -1
    });
    this.anims.create({
      key: 'run', frames: [
        { key: 'climber_sheet', frame: 1 },
        { key: 'climber_sheet', frame: 0 },
        { key: 'climber_sheet', frame: 2 },
        { key: 'climber_sheet', frame: 0 },
      ],
      frameRate: 8, repeat: -1
    });
    this.anims.create({
      key: 'jump', frames: [{ key: 'climber_sheet', frame: 3 }],
      frameRate: 1, repeat: 0
    });

    // ── Collisions ──
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // ── Camera ──
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0);

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
    this.finishLine = this.add.rectangle(WORLD_W - 80, 400, 20, 120, 0xffdd00)
      .setOrigin(0.5, 0.5);
    this.physics.add.existing(this.finishLine, true);
    this.physics.add.overlap(this.player, this.finishLine, this.winLevel, null, this);

    // Win flag text
    this.add.text(WORLD_W - 80, 340, '🏁', {
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

    // ── Parallax scrolling ──
    const camX = this.cameras.main.scrollX;
    this.bgSky.tilePositionX = camX * 0.05;
    this.bgFar.tilePositionX = camX * 0.15;
    this.bgNear.tilePositionX = camX * 0.3;

    // ── Fall death ──
    if (this.player.y > WORLD_H + 50) {
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

const game = new Phaser.Game(config);

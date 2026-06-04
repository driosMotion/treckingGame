# 🏔 treckingGame

A mobile-web 2D pixel platformer about trekking through the mountains. Built with **Phaser.js 3**.

Inspired by Super Mario Bros 3 — tight platforming, pixel art, parallax backgrounds, and a sense of adventure.

## 🎮 Play

**🌐 https://driosmotion.github.io/treckingGame/**

Or run locally:

```bash
cd treckingGame && python3 -m http.server 8080
# → http://localhost:8080
```

Works on desktop (keyboard) and mobile (touch controls).

### Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | ← → arrows | Left/Right buttons (bottom-left) |
| Jump | ↑ or Space | Red A button (bottom-right) |

## 🗺 Roadmap

### v0.1 — Foundation ✅
- [x] Phaser 3 setup with mobile scaling
- [x] Pixel art rendering pipeline
- [x] Player sprite (climber) with run/jump/idle animations
- [x] Parallax background (sky → far mountains → near mountains)
- [x] Terrain tiles (grass, dirt, stone, snow)
- [x] Basic level with platforms, gaps, coins
- [x] Touch controls for mobile
- [x] Win condition + restart

### v0.2 — Trecking Mechanics (next)
- [ ] Stamina system — sprinting depletes stamina, regens when walking
- [ ] Altitude meter — higher = thinner air, slower stamina regen
- [ ] Temperature zones — cold = slower, need to keep moving
- [ ] Rope mechanic — rappel down steep cliffs
- [ ] Crampons/gear pickups

### v0.3 — Enemies & Hazards
- [ ] Falling rocks (timed hazard)
- [ ] Avalanche segments (run from it!)
- [ ] Eagles / mountain goats
- [ ] Deep snow that slows you down
- [ ] Crevasses (gaps that need a running jump)

### v0.4 — Progression
- [ ] Multi-level world with mountain theme
- [ ] Checkpoints / camps
- [ ] Collectible gear (climbing axe, ropes, oxygen)
- [ ] Time trial mode
- [ ] High score / coin counter

### v0.5 — Polish
- [ ] Real pixel art assets (replace programmatic sprites)
- [ ] Sound effects + chiptune music
- [ ] Particle effects (snow, dust)
- [ ] Screen shake on landings
- [ ] Level editor
- [ ] PWA (installable on phone)

## 🧱 Tech Stack

- **[Phaser.js 3](https://phaser.io/)** — Game engine (physics, rendering, input, camera)
- **Vanilla JS** — No build step needed for v0.x (just serve HTML)
- **CDN** — Phaser loaded from `cdn.jsdelivr.net`
- **Future** — Vite + Phaser template for larger codebase

## 🎨 Asset Sources (free/CC0)

| Asset | Source | License |
|-------|--------|---------|
| Kenney Pixel Platformer | [kenney.nl](https://kenney.nl/assets/pixel-platformer) | CC0 |
| Mountain Trek Tileset | [ansimuz (itch.io)](https://ansimuz.itch.io/mountain-trek-tileset) | CC0 |
| Mountain Parallax Background | [OpenGameArt](https://opengameart.org/content/mountain-parallax-background) | CC0 |
| Pixel UI Pack | [Kenney](https://kenney.nl/assets/ui-pack) | CC0 |

## 🚀 Quick Start

```bash
git clone ... # or copy files
cd treckingGame
python3 -m http.server 8080
open http://localhost:8080
```

No npm install needed until you outgrow the single-file setup.

---

🏔 *Conquer the peaks, one pixel at a time.*

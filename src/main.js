import Phaser from './lib/phaser.js';
import { banana } from './fruits.js';
import { Game } from './scenes/Game.js'
import { GameOver } from './scenes/GameOver.js'
console.dir(Game)
export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: false
    }
  }
})
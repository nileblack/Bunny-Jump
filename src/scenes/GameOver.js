import Phaser from '../lib/phaser.js'

export class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }
  preload() {
        this.load.image('background', 'assets/bg_layer1.png')
  }
  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0)

    const width = this.scale.width;
    const height = this.scale.height;
    console.log(width, height)
    this.add.text(width * .5, height * .5 - 80, 'Game Over', { color:'#000' , fontSize: 48 })
      .setOrigin(.5)
     this.add.text(width * .5, height * .5 + 32, 'Press SPACE to Restart', { color:'#000' , fontSize: 24 })
      .setOrigin(.5)
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game')
    })
  }
}
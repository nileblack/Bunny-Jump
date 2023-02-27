import Phaser from "../lib/phaser.js";
import Carrot from './Carrot.js'
export class Game extends Phaser.Scene {
  carrotsCollected = 0
  constructor() {
    super('game')
  }
  init() {
    this.carrotsCollected = 0
  }
  preload() {
    this.load.image('background', 'assets/bg_layer1.png')
    this.load.image('platform', 'assets/ground_grass.png')

    this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    this.load.image('carrot', 'assets/carrot.png')
  }
  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0)
    this.platforms = this.physics.add.staticGroup()
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = .5
      const body = platform.body
      body.updateFromGameObject()
    }

    this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(.5)
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false

    this.physics.add.collider(this.platforms, this.player)

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.carrots = this.physics.add.group({ classType: Carrot })
    this.carrots.get(240, 320, 'carrot')

    this.physics.add.collider(this.platforms, this.carrots)
    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

    const style = { color: '#000', fontSize: 24 }
    this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0)

    const width = this.scale.width;
    const height = this.scale.height;
    this.add.text(10, height -20 ,'press up,left,right arrow key to move', {color:'white',fonsSize:12}).setScrollFactor(0)
  }
  update() {
    const touchingDown = this.player.body.touching.down
    // if (touchingDown) {
    //   this.player.setVelocityY(-300)
    // }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200)
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }
    if (this.cursors.up.isDown && touchingDown) {
      this.player.setVelocityY(-300)
    }

    this.platforms.children.iterate(child => {
      const platform = child
      const scrollY = this.cameras.main.scrollY
      if (platform.y > scrollY + 700) {
        platform.y = scrollY + Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.addCarrotAbove(platform)
      }
    })
    this.horizontalWrap(this.player)

    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start('game-over')
    }
  }
  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot)
    this.physics.world.disableBody(carrot.body)
    this.carrotsCollected++
    const value = `Carrots: ${this.carrotsCollected}`
    this.carrotsCollectedText.text = value
  }
  addCarrotAbove(sprite) {
    const y = sprite.y + sprite.displayHeight
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    carrot.setActive(true)
    carrot.setVisible(true)
    this.add.existing(carrot)

    carrot.body.setSize(carrot.width, carrot.height)
    this.physics.world.enable(carrot)
    return carrot
  }
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * .5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }
  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren()
    let bottomPlatform = platforms[0]
    for (let i = 0; i < platforms.length; i++) {
      if (bottomPlatform.y < platforms[i].y) {
        bottomPlatform = platforms[i]
      }
    }
    return bottomPlatform
  }
}
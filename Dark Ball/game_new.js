let game_over = false;
let score = 0;
let scoreText;
let restartButton;

class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }


    preload() {
        this.load.image('block', 'sprites/block1.png');
        this.load.image('paddle', 'sprites/Tiles.png');
        this.load.image('ball', 'sprites/Spell_sphere_astralDark.png');
        this.load.image('back', 'sprites/Pause (1).png');
        this.load.image('invisible', 'sprites/Invisible.png');
    }

    create() {
        this.add.image(400, 300, 'back');

        const menuButton = this.add.text(0, 50, 'Menu', { fontSize: '24px', fill: '#ffffff' }).setOrigin(1,0);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.start('Menu'); 
        });
    

        this.blocks = this.physics.add.group();
        const blockWidth = 64;
        const blockHeight = 32;
        let blockX = 150;
        let blockY = 50;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 8; j++) {
                const block = this.blocks.create(blockX + j * blockWidth + 20, blockY + i * blockHeight + 10, 'block').setScale(0.5, 0.5);
            }
        }

        this.paddle = this.physics.add.sprite(400, 550, 'paddle').setImmovable();
        this.paddle.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ball = this.physics.add.sprite(400, 550, 'ball');
        this.ball.setVelocity(150, -150);
        this.ball.setBounce(1, 1);
        this.ball.setCollideWorldBounds(true);
        this.ball.setScale(0.05, 0.05);

        this.physics.add.collider(this.ball, this.blocks, this.hitBlock, null, this);
        this.physics.add.collider(this.ball, this.paddle);

        this.bottomBoundary = this.physics.add.sprite(400, 600, 'invisible').setImmovable();
        this.bottomBoundary.setVisible(false);
        this.bottomBoundary.body.setSize(800, 10);
        this.physics.add.collider(this.ball, this.bottomBoundary, this.gameOver, null, this);

        
        scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
    }

    update() {
        if (game_over) return;
        if (this.cursors.left.isDown) {
            this.paddle.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.paddle.setVelocityX(300);
        } else {
            this.paddle.setVelocityX(0);
        }
    }

    hitBlock(ball, block) {
        this.physics.world.remove(block);
        block.destroy();
        this.ball.setVelocity(150, -150);
        score += 10;
        scoreText.setText('Score: ' + score);
    }

    gameOver() {
        game_over = true;
        this.ball.setVelocity(0, 0);
    
        const gameOverText = this.add.text(400, 300, 'Game Over!', {
            fontSize: '64px',
            fill: '#00f4ff',
            align: 'center'
        });
        gameOverText.setOrigin(0.5, 0.5);
    
        const scoreText = this.add.text(400, 370, 'Your score: ' + score, {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center'
        });
        scoreText.setOrigin(0.5, 0.5);

        restartButton = this.add.text(400, 440, 'Restart', { fontSize: '32px', fill: '#00ff1e' }).setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}


class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
       
        this.add.rectangle(400, 300, 800, 600, 0x222222); 

        // Создаем текст заголовка
        this.add.text(400, 100, 'Dark ball', { fontSize: '48px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);

        const startButton = this.add.text(400, 200, 'Start game', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('Game'); 
        });
    }
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    },
    scene: [MenuScene, GameScene] 
};

const game = new Phaser.Game(config);



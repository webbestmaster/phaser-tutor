var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

var spacefield;

var backgroundv;

var player;

var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var winText;


var mainState = {

	preload: function () {

		game.load.image('starfield', 'assets/spacefield.jpeg');
		game.load.image('player', 'assets/player.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('enemy', 'assets/enemy.png');

	},

	create: function () {

		spacefield = game.add.tileSprite(0,0,800, 600, 'starfield');
		backgroundv = 6;

		player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		game.physics.enable(player, Phaser.ARCADE);

		cursors = game.input.keyboard.createCursorKeys();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(10, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		createEnemies();

		scoreText = game.add.text(0,550, 'Score:', {font: '32px Arial'});

		winText = game.add.text(game.world.centerX,game.world.centerY, 'You Win', {font: '32px Arial'});

		winText.visible = false;


	},

	update: function () {

		game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);

		spacefield.tilePosition.y += backgroundv;

		player.body.velocity.x = 0;

		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;
		}

		if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;
		}

		if (fireButton.isDown) {

			fireBullet();

		}

		scoreText.text = 'Score:' + score;


		if (score === 4000) {
			winText.visible = true;
			scoreText.visible = false;
		}

	}

};

game.state.add('mainState', mainState);
game.state.start('mainState');


function fireBullet() {

	if (game.time.now > bulletTime) {

		bullet = bullets.getFirstExists(false);

		if (bullet) {
			bullet.reset(player.x + 32, player.y);
			bullet.body.velocity.y = -40;
			bulletTime = game.time.now + 200;
		}

	}

}


function collisionHandler(bullet, enemy) {

	bullet.kill();
	enemy.kill();

	score += 100;

}

function createEnemies() {


	for (var y = 0; y < 4; y += 1) {



		for (var x = 0; x < 10; x += 1) {

			var enemy = enemies.create(x * 48, y * 50, 'enemy');

			enemy.anchor.setTo(0.5, 0.5);



		}


	}


	enemies.x = 100;
	enemies.y = 50;


	var tween = game.add.tween(enemies).to({x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, Infinity, true);

	tween.onRepeat.add(descend, null);

}


function descend() {

	enemies.y += 10;

}

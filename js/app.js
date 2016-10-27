//X and Y dimensions of each block - for use in determining origin coordinates
var xBlock = 101;
var yBlock = 83;



// Create Enemy "class"
var Enemy = function(start) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.speed = Math.random()*100+150;
    this.y = start * yBlock - 20;
    this.x = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if (this.x > 503/* && this.x < 506*/) {
        allEnemies.push(new Enemy(Math.floor(Math.random()*3)+1));
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
        //allEnemies.push(new Enemy(1));
    }
};

//resets starting coordinates of enemies
Enemy.prototype.reset = function(start){
        this.y = start * yBlock - 20;
        this.x = 0;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};





//Create Player "class"
var Player = function() {
    this.spriteArray = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png']
    this.selector = 'images/Selector.png';
    this.x = xBlock * 2;
    this.y = yBlock * 4 + 43;
    this.score = 0;
    this.lives = 10000;
}

//resets the player's location and raises score by 1 if water is reached
Player.prototype.update = function() {
    if (this.y < 20){
    	achievement.play();
        this.reset();
        this.scoreKeeper(1);
    }
}

//resets player location - used in .update() and checkCollisions()
Player.prototype.reset = function() {
    this.x = xBlock * 2;
    this.y = yBlock * 4 + 43;
    return this.x, this.y;
}

//Draws player onto game board
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Handles input for player (moving up, down, left, right)
Player.prototype.handleInput = function(keys) {
    if (this.lives > 0){
        switch(keys){
            case 'left':
                if (this.x >= xBlock){
                    this.x -= xBlock;
                };
                break;
            case 'right':
                if (this.x <= xBlock*3){
                    this.x += xBlock;
                };
                break;
            case 'up':
                if (this.y >= 0){
                    this.y -= yBlock;
                };
                break;
            case 'down':
                if (this.y <= yBlock*4){
                    this.y += yBlock;
                };
                break;
        }
    }
}

//Changes the score - use "1" as parameter if gaining a point and "-1" if losing a point
Player.prototype.scoreKeeper = function(point){
    this.score += point;
    item.update();
    extraLife.update();
    return this.score;
}

//updates text display for player score - text display is implemented using the renderScore() function
Player.prototype.updateScore = function(){
    this.scoreText = null;
    if (this.score < 10){
        this.scoreText = "Score: 00" + player.score;
    };
    if (this.score >= 10 && player.score < 100){
        this.scoreText = "Score: 0" + player.score;
    };
    if (this.score >= 100 && player.score < 1000){
        this.scoreText = "Score: " + player.score;
    };
    if (this.score >= 1000){
        this.scoreText = "Stop it. This game isn't that good. Go read a book or something.";
    };
};

//displays score on screen
Player.prototype.renderScore = function(){
    var xScore = 350;
    var yScore = 577;

    ctx.fillText(this.scoreText, xScore, yScore);
    ctx.strokeText(this.scoreText, xScore, yScore);
}

//resets score (for use in various reset functions)
Player.prototype.resetScore = function(){
    this.score = 0;
}

//updates text display for player lives - implemented with renderLives function
Player.prototype.updateLives = function(life){
    this.lives += life;
}

//display remaining player lives
Player.prototype.renderLives = function(){
    var xLives = 15;
    var yLives = 577;

    ctx.fillText("Lives: " + this.lives, xLives, yLives);
    ctx.strokeText("Lives: " + this.lives, xLives, yLives);
}

//reset lives - 4 rather than three so that the start screen functions don't work when the game is being played 
Player.prototype.resetLives = function(){
    this.lives = 4;
}


//creates character select menu over start screen
Player.prototype.renderCharSelect = function(xLocation){
    ctx.drawImage(Resources.get(this.selector), xBlock * xLocation, yBlock * 4 + 43);
    i = 0;
    this.spriteArray.forEach(function(sprite){
        ctx.drawImage(Resources.get(sprite), xBlock * i, yBlock * 4 + 43);
        i++;
    });
};   

//takes the sprite chosen during the character select screen and uses it for game play
Player.prototype.charSelect = function(i){
	this.sprite = this.spriteArray[i];
}

 

//Item "class"
var Item = function(f){
    this.x = -100;
    this.y = -100;
    this.spriteArray = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
    this.sprite = null;
    this.frequency = f;
}

//updates location of item (item shows up whenever score is a multiple of 6)
Item.prototype.update = function(){
    if (player.score > 1 && player.score % this.frequency == 0){
        if (this.spriteArray.length > 1){
        	this.sprite = Resources.get(this.spriteArray[Math.floor(Math.random()*3)])
        }
        else {
        	this.sprite = Resources.get(this.spriteArray[0]);
        }
        this.x = (Math.floor(Math.random()*5)) * xBlock;
        this.y = (Math.floor(Math.random()*3)+1) * yBlock - 20;
    }
}

//displays item - one item will appear for every six points scored
Item.prototype.render = function(){
    if (player.score > 1 && player.score % this.frequency == 0){
    	//console.log(this.sprite);
        ctx.drawImage(this.sprite, this.x, this.y);
    }
}


Item.prototype.reset = function(){
	this.x = -100;
	this.y = -100;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var pickup = new Audio('audio/pickup.wav');
var achievement = new Audio('audio/achievement.wav');
var hit = new Audio('audio/hit.wav');
var menuNavigate = new Audio('audio/menu-navigate.wav');
var heroDeath = new Audio('audio/hero-death.wav');
var backgroundMusic = new Audio('audio/octoberwalrus-cosmicdanceparty.mp3');
backgroundMusic.volume = 0.3;


var player = new Player();
var allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
//instantiates item object
var item = new Item(6);
var extraLife = new Item(10);
extraLife.spriteArray = ['images/Star.png'];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down', 
        13: 'enter',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


//checks for collisions between player and enemies/items
function checkCollisions() {
	//if player collides with enemy, lose one life and restart from origin point
    allEnemies.forEach(function(enemy){
        if (player.x - enemy.x >= -47 && player.x - enemy.x <= 63 && player.y - enemy.y >= -64 && player.y - enemy.y <= 51){
        	hit.play();
            player.reset();
            player.updateLives(-1);
        }
    })
    //if player collides with an item, gain one point
    if (player.x - item.x <= 67 && player.x - item.x >= -66 && player.y - item.y <= 48 && player.y - item.y >= -87){
        player.scoreKeeper(1);
        pickup.play();
        item.reset();
    }
    //if player collides with an extraLife, gain one life
    if (player.x - extraLife.x <= 50 && player.x - extraLife.x >= -51 && player.y - extraLife.y <= 59 && player.y - extraLife.y >= -61){
        player.updateLives(1);
        pickup.play();
        extraLife.reset();
    }
}














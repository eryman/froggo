/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */


var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    //the following lines control text style
    ctx.font = "24pt impact";
	ctx.textAlign = "left"
    ctx.fillStyle = "yellow";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.save();




	

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        //added the following three lines to stop animation in game over screen to allow the character select screen to come back
        if (player.lives == 0){
            return null;
        }


        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        //added the following three lines to play a sound effect and background music when the game begins
        sound.hit.play();
        sound.backgroundMusic.src = 'audio/octoberwalrus-cosmicdanceparty.mp3'
        sound.backgroundMusic.volume = 0.3;
        sound.backgroundMusic.play();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        player.checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            if (enemy.isGone === true) {
                allEnemies.push(new Enemy(Math.floor(Math.random()*3)+1));
                var index = allEnemies.indexOf(enemy);
                allEnemies.splice(index, 1);
            }
        });
        player.update();
        player.updateScore();
    }



    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        renderBackground();
        renderEntities();
    }

    //encapsulated the background rendering into its own function so that it can easily be called elsewhere
    function renderBackground(){     
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    };


    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        //added calls to extra functions to keep track of score and items
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        item.render();
        extraLife.render();
        player.render();
        player.renderScore();
        player.renderLives();
        gameOver();

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
	function reset() {
	    player.reset();
	    player.resetScore();
	    player.resetLives();
	    i = 1;
	    allEnemies.forEach(function(enemy){
	    	enemy.reset(i);
	    	i++;
	    })
        player.lives = 3;
	}


    //prepares event listeners for character select and game over screens
	document.addEventListener('keyup', function(e) {
	    var allowedKeys = {
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down', 
	        13: 'enter',
	        32: 'space'
	    };
	    gameOverInput(allowedKeys[e.keyCode]);
	    startGameInput(allowedKeys[e.keyCode]);
	});

    //variable used as parameter for player.renderCharSelect() -- changes with key strokes in startGameInput function
    var i = 0;  

        //loads the character select screen
    function loadCharSelect(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderBackground();
        player.renderCharSelect(0);
        renderStartText();
    }

    //displays text for start screen
    function renderStartText(){
        ctx.save()
        ctx.font = "80pt impact";
        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        ctx.fillText("FROGGO!", canvas.width/2, canvas.height/2 - 50);
        ctx.strokeText("FROGGO!", canvas.width/2, canvas.height/2 - 50); 
        ctx.font = "20pt impact";
        ctx.textAlign = "center";
        ctx.lineWidth = 2;
        ctx.fillText("A misleadingly titled game!", canvas.width/2, canvas.height/2-15);
        ctx.strokeText("A misleadingly titled game!", canvas.width/2, canvas.height/2-15);
        ctx.fillText("Use arrow keys to select player", canvas.width/2, canvas.height/2 + 40);
        ctx.strokeText("Use arrow keys to select player", canvas.width/2, canvas.height/2 + 40);
        ctx.fillText("and press Enter to play!", canvas.width/2, canvas.height/2 + 70);
        ctx.strokeText("and press Enter to play!", canvas.width/2, canvas.height/2 + 70);    
        ctx.restore();
    }
    
	function startGameInput(keys) {
        if (player.isSelected === false){    
            switch(keys){
      	        case 'enter':
                    player.charSelect(i);
    	            init();
    	            break;
                case 'left':
                    if (i > 0) {
                        sound.menuNavigate.play();
                        i--;                    
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        renderBackground();
                        player.renderCharSelect(i);
                        renderStartText();
                    }
    	            break;
    	        case 'right':
                    if (i < 4) {
                        sound.menuNavigate.play();
                        i++;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        renderBackground();
                        player.renderCharSelect(i);
                        renderStartText();
                    }
    	            break;
    	    }
        }
	}

    //creates a game over screen once player.lives reaches 0
    function gameOver(){
        if (player.lives === 0){
            sound.backgroundMusic.src = "";
            sound.heroDeath.play();
            ctx.save()
            ctx.font = "70pt impact";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 + 50);
            ctx.strokeText("GAME OVER", canvas.width/2, canvas.height/2 + 50); 
            ctx.font = "20pt impact";
            ctx.fillText("Press Spacebar to play again!", canvas.width/2, canvas.height/2 + 80);
            ctx.strokeText("Press Spacebar to play again!", canvas.width/2, canvas.height/2 + 80); 
            ctx.restore();
            gameOverInput();

        }
    }
    //resets all objects after game over and reloads character select screen when 'space' is pressed 
	function gameOverInput(keys) {
        if (player.lives === 0) {
    	    switch(keys){
    	        case 'space':
                    sound.hit.play();
                    reset();
                    player.isSelected = false;
                    i = 0;
                    loadCharSelect();
    	            break;
	        };
        }
	}



    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Star.png'
    ]);
    //changed the line below so that it calls 'loadCharSelect' rather than 'init' -- 'loadCharSelect' calls 'init' when 'enter' is pressed
    Resources.onReady(loadCharSelect);


    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
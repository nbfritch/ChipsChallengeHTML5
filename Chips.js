const TICK_LENGTH = 100;
    const CHIP_ANIMATION_TIMEOUT_TICKS = 3;
    const CHIP_DEFAULT_START_POSITION = {x: 7, y: 7};
    const TILESIZE = 32;
    const TILES = {
        blank: 0,
        solid: 1,
        chip: 2,
        water: 3,
        fire: 4,
        blank1: 5,
        thinwall_top: 6,
        thinwall_left: 7,
        thinwall_down: 8,
        thinwall_right: 9,
        block: 10,
        dirt: 11,
        ice: 12,
        arrow_down: 13,
        block1: 14,
        block2: 15,
        block3: 16,
        block4: 17,
        arrow_up: 18,
        arrow_right: 19,
        arrow_left: 20,
        exit: 21,
        blue_lock: 22,
        red_lock: 23,
        green_lock: 24,
        yellow_lock: 25,
        icetrack_topleft: 26,
        icetrack_topright: 27,
        icetrack_bottomright: 28,
        icetrack_bottomleft: 29,
        tempwall: 30,
        tempwall1: 31,
        blank2: 32,
        thief: 33,
        exitgate: 34,
        green_button: 35,
        red_button: 36,
        togglewall_solid: 37,
        togglewall_blank: 38,
        grey_button: 39,
        blue_button: 40,
        teleporter: 41,
        bomb: 42,
        trap: 43,
        blank3: 44,
        gravel: 45,
        popup_wall: 46,
        help: 47,
        thinwall_bottomright: 48,
        spawner_base: 49,
        arrow_random: 50,
        splash: 51,
        chip_onfire: 52,
        chip_burnt: 53,
        blank4: 54,
        blank5: 55,
        blank6: 56,
        chip_on_exit: 57,
        exit_animation1: 58,
        exit_animation2: 59,
        chip_swim_up: 60,
        chip_swim_left: 61,
        chip_swim_down: 62,
        chip_swim_right: 63,
        bug_up: 64,
        bug_left: 65,
        bug_down: 66,
        bug_right: 67,
        fire_mob: 68,
        fire_mob1: 69,
        fire_mob2: 70,
        fire_mob3: 71,
        ball_mob: 72,
        ball_mob1: 73,
        ball_mob2: 74,
        ball_mob3: 75,
        tank_up: 76,
        tank_left: 77,
        tank_down: 78,
        tank_right: 79,
        glider_up: 80,
        glider_left: 81,
        glider_down: 82,
        glider_right: 83,
        teeth_up: 84,
        teeth_left: 85,
        teeth_down: 86,
        teeth_right: 87,
        roller_up: 88,
        roller_left: 89,
        roller_down: 90,
        roller_right: 91,
        blob: 92,
        blob1: 93,
        blob2: 94,
        blob3: 95,
        fur_up: 96,
        fur_left: 97,
        fur_down: 98,
        fur_right: 99,
        blue_key: 100,
        red_key: 101,
        green_key: 102,
        yellow_key: 103,
        flipper: 104,
        fireboot: 105,
        iceskate: 106,
        suctionboot: 107,
        chip_up: 108,
        chip_left: 109,
        chip_down: 110,
        chip_right: 111
    };

    class level {
        constructor(levelNumber,levelData) {
            this.levelNumber = levelNumber;
            this.levelData = levelData;
        }
    }

    const testCreatureAI = {

    }

    //Constructor to 
    class gameState {
        constructor(boardSize,numChips,time) {
            this.boardSize = boardSize;                     //The board is a square of this amount
            this.board = new Array(this.boardSize);         //Main block array
            for(let i = 0; i < this.board.length; i ++) {
                this.board[i] = new Array(this.boardSize);  //Make the array 2d
            }
            for(let i = 0; i < this.boardSize; i++) {
                for(let j = 0; j< this.boardSize; j++) {
                    this.board[i][j] = TILES.blank;         //Populate the entire array with tiles
                }
            }

            this.chipx = CHIP_DEFAULT_START_POSITION.x;                                 //Chip starts at this location
            this.chipy = CHIP_DEFAULT_START_POSITION.y;

            this.chip_ticks_until_standing = 0;
            this.board[this.chipx][this.chipy] = TILES.chip_down; //Render chip for now

            //States of all the keys
            this.redKey = 0;
            this.yellowKey = 0;
            this.greenKey = false;
            this.blueKey = 0;

            //States of all the equipment
            this.fireBoots = false;
            this.flippers = false;
            this.suctionBoots = false;
            this.iceSkates = false;

            //States for chips and time
            this.numChips = numChips;
            this.collectedChips = 0;
            this.time = time;
        }

        decrementTimer() {
            if(this.time !== -1) {
                this.time = this.time - 1;
            }
        }

        render() {
            //This method performs actions that need to be done at every render cycle.
            if(this.chip_ticks_until_standing) {
                this.chip_ticks_until_standing --;
            } else {
                this.board[this.chipx][this.chipy] = TILES.chip_down;
            }
        }

        moveLeft() {
            if(this.chipx > 0) {
                this.board[this.chipx][this.chipy] = TILES.blank;
                this.board[this.chipx-1][this.chipy] = TILES.chip_left;
                this.chipx = this.chipx-1;
            }
            this.chip_ticks_until_standing = CHIP_ANIMATION_TIMEOUT_TICKS;
        }

        moveRight() {
            if(this.chipx < this.boardSize) {
                this.board[this.chipx][this.chipy] = TILES.blank;
                this.board[this.chipx+1][this.chipy] = TILES.chip_right;
                this.chipx = this.chipx + 1;
            }
            this.chip_ticks_until_standing = CHIP_ANIMATION_TIMEOUT_TICKS;
        }

        moveUp() {
            if(this.chipy > 0) {
                this.board[this.chipx][this.chipy] = TILES.blank;
                this.board[this.chipx][this.chipy-1] = TILES.chip_up;
                this.chipy = this.chipy-1;
            }
            this.chip_ticks_until_standing = CHIP_ANIMATION_TIMEOUT_TICKS;
        }

        moveDown() {
            if(this.chipy < this.boardSize) {
                this.board[this.chipx][this.chipy] = TILES.blank;
                this.board[this.chipx][this.chipy+1] = TILES.chip_down;
                this.chipy = this.chipy + 1;
            }
            this.chip_ticks_until_standing = CHIP_ANIMATION_TIMEOUT_TICKS;
        }
    }

    function initialize() {
        //This function is only called once on page load.
    }

    function onBeforeRender() {
        //This function is called before every render cycle.
    }

    function render() {
        //This function is called on every render cycle.
    }

    function onAfterRender() {
        //This function is called after every render cycle.
    }

    //this class loads the canvas and tileset objects and also contains the gamestate
    class game {
        constructor(canvas,tileset) {
            this.tileset = tileset;
            this.canvas = canvas;
            this.gameState = new gameState(15,0,-1);
            this.nextGameState = new gameState(15,0,-1);

            this.chipup = false;
            this.chipdown = false;
            this.chipleft = false;
            this.chipright = false;
        }

        input(direction) {
            switch(direction) {
                case "up": this.chipup = true; break;
                case "down": this.chipdown = true; break;
                case "left": this.chipleft = true; break;
                case "right": this.chipright = true; break;
                default: break;
            }
        }

        calculateNextState() {
            this.gameState.render();
            if(this.chipup) {
                this.gameState.moveUp();
                this.chipup = false;
                return;
            }
            if(this.chipdown) {
                this.gameState.moveDown();
                this.chipdown = false;
                return;
            }
            if(this.chipleft) {
                this.gameState.moveLeft();
                this.chipleft = false;
                return;
            }
            if(this.chipright) {
                this.gameState.moveRight();
                this.chipright = false;
                return;
            }
        }

        doTimerTick() {
            this.gameState.decrementTimer();
        }

        renderGameState() {
            for(let i = 0; i<this.gameState.board[0].length; i++)
            {
                for(let j = 0; j<this.gameState.board.length; j++)
                {
                    this.renderBlock(i,j,this.gameState.board[i][j]);
                }
            }
        }

        renderBlock(areax,areay,blockId) {
            this.canvas.drawImage
            (
                this.tileset,        //Tile source
                TILESIZE*(Math.floor(blockId/16)),     //Y coord is the blockId / 16
                TILESIZE*(blockId%16),     //X coord is the blockId % 16
                TILESIZE,       //Standard tile size for width of clipped image
                TILESIZE,       //Standard tile size for height of clipped image
                TILESIZE*areax, //Multiply tile size by the location to get the pixel
                TILESIZE*areay, //Multiply tile size by the location to get exact pixel
                TILESIZE,       //Standard tile size for width to transform onto
                TILESIZE        //Standard tile szie for height to transform onto
            );
        }
    }

    var main = function()
    {   
        //Get the canvas
        var c = document.getElementById("canvas");
        c.tabIndex = 1000;
        //Create the 2d context
        var ctx = c.getContext("2d");
        //Get the tileset
        var tileset = document.getElementById("tileset");
        //Create a new game instance
        let g = new game(ctx,tileset);

        //register listener for arrow keys
        document.addEventListener("keydown",function(e){
            if (e.keyCode == '38') {
                g.input("up");
            } else if(e.keyCode == '40') {
                g.input("down");
            } else if(e.keyCode == '37') {
                g.input("left");
            } else if(e.keyCode == '39') {
                g.input("right");
            }
        },false);

        //Start the game tick
        setInterval(function() {
            g.calculateNextState();
            g.renderGameState();
        },TICK_LENGTH);

        //Start the timer
        setInterval(function() {
            g.doTimerTick();
        },1000);
    }
    
    document.addEventListener("DOMContentLoaded", main);
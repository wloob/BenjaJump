var canvas;

var host = "https://raw.githubusercontent.com/Buggiam/BenjaJump/master/";

var useHost = true;

var scl;
var canvasWidth = 30;
var canvasHeight = 15;
var borderHeight = 50;

var oldScl;

var player;
var right = false;
var left = false;
var up = false;
var down = false;

var map;

function preload() {
    addLoadedImage("assets/texture/rock0.png")

    addLoadedImage("assets/player/stand0.png");
    addLoadedImage("assets/player/stand1.png");

    addLoadedImage("assets/player/run0.png");
    addLoadedImage("assets/player/run1.png");
    addLoadedImage("assets/player/run2.png");
    addLoadedImage("assets/player/run3.png");
    addLoadedImage("assets/player/run4.png");

    addLoadedImage("assets/player/air0.png");

    addLoadedImage("assets/player/jump0.png");
    addLoadedImage("assets/player/jump1.png");
    addLoadedImage("assets/player/jump2.png");
    addLoadedImage("assets/player/jump3.png");

    scaleCanvas();
}

function setup() {
    player = new Player(400, 50);

    canvas = createCanvas(canvasWidth * scl, canvasHeight * scl);
    canvas.parent('sketch-holder');

    oldScl = scl;

    map = new Map();
    map.initiate("maps/map1");
    map.setTile(4, 3, 1);
    map.setTile(10, 6, 2);
    map.setTile(17, 6, 1);
    map.setTile(25, 10, 2);
    map.setTile(2, 10, 1);
    map.setTile(29, 3, 1);
    map.setTile(35, 7, 2);
    map.setTile(42, 5, 1);
    map.setTile(45, 11, 1);
    map.setTile(50, 8, 2);
    map.setTile(58, 5, 2);
}

function draw() {
    tick();

    background(41, 234, 244);

    map.draw();

    player.playerTick();
    player.show();
}

function tick() {
    move();
    player.tick();
}

function move() {
    if (right)
        player.moveRight();
    if (left)
        player.moveLeft();
    if (up)
        player.jump();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW)
        left = true;
    else if (keyCode === RIGHT_ARROW)
        right = true;
    else if (keyCode === UP_ARROW) {
        player.jump();
        up = true;
    }
    else if (keyCode === DOWN_ARROW) {
        down = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW)
        left = false;
    else if (keyCode === RIGHT_ARROW)
        right = false;
    else if (keyCode === UP_ARROW)
        up = false;
    else if (keyCode === DOWN_ARROW)
        down = false;
}

function windowResized() {
    scaleCanvas();
    map.scale();
    player.scale();

    oldScl = scl;
}

function scaleCanvas() {
    scl = 1;
	while (windowWidth > scl * canvasWidth && windowHeight > scl * canvasHeight + borderHeight) {
		scl++;
	}
    if (canvas != null)
        resizeCanvas(canvasWidth * scl, canvasHeight * scl);
}

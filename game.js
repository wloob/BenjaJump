var canvas;

var host = "https://raw.githubusercontent.com/Buggiam/BenjaJump/master/";
var mapPath  = "maps/";

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
    addLoadedMap("test-map");

    addLoadedImage("assets/texture/rock/rock0.png")

    addLoadedImage("assets/player/default/stand0.png");
    addLoadedImage("assets/player/default/stand1.png");

    addLoadedImage("assets/player/default/run0.png");
    addLoadedImage("assets/player/default/run1.png");
    addLoadedImage("assets/player/default/run2.png");
    addLoadedImage("assets/player/default/run3.png");
    addLoadedImage("assets/player/default/run4.png");

    addLoadedImage("assets/player/default/air0.png");

    addLoadedImage("assets/player/default/jump0.png");
    addLoadedImage("assets/player/default/jump1.png");
    addLoadedImage("assets/player/default/jump2.png");
    addLoadedImage("assets/player/default/jump3.png");

    scaleCanvas();
}

function setup() {
    canvas = createCanvas(canvasWidth * scl, canvasHeight * scl);
    canvas.parent('sketch-holder');

    oldScl = scl;

    map = new Map();
    map.initiate("test-map");

    player = new Player(map.spawnX * scl, map.spawnY * scl);
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

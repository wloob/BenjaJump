var canvas;

var noUpdateTicks = 0;

var useHost = false;
var host = "https://raw.githubusercontent.com/Buggiam/BenjaJump/master/";
var mapPath  = "maps/";
var backgroundPath = "assets/backgrounds/";

var scl;
var canvasWidth = 30;
var canvasHeight = 15;
var borderHeight = 30;

var oldScl;

var player;
var right = false;
var left = false;
var up = false;
var down = false;

var map;

function preload() {
    addLoadedMap("test5");
    addLoadedMap("test-map");
    addLoadedMap("test-map2");
    addLoadedMap("test-map3");

    addLoadedImage(backgroundPath + "hills.png");

    addLoadedImage("assets/texture/tiles/1.png");
    addLoadedImage("assets/texture/tiles/2.png");
    addLoadedImage("assets/texture/tiles/3.png");
    addLoadedImage("assets/texture/tiles/18.png");

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

    addLoadedImage("assets/player/default/wall0.png");

    scaleCanvas();
}

function setup() {
    canvas = createCanvas(canvasWidth * scl, canvasHeight * scl);
    canvas.parent('sketch-holder');

    oldScl = scl;

    player = new Player();

    map = new Map();
    map.initiate("test-map3");

    player.x = map.spawnX * scl;
    player.y = map.spawnY * scl + 1;
}

function draw() {
    if (noUpdateTicks > 0) {
        noUpdateTicks--;
    } else
        tick();

    background(41, 234, 244);

    map.draw();

    player.show();
}

function tick() {
    move();

    player.tick();
    player.playerTick();
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

    noUpdateTicks = 10;
}

function scaleCanvas() {
    scl = 1;
	while (windowWidth > canvasWidth * (scl + 1) && windowHeight > canvasHeight * (scl + 1) + borderHeight) {
		scl++;
	}
    if (canvas != null)
        resizeCanvas(canvasWidth * scl, canvasHeight * scl);
}

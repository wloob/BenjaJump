function Player() {
    Entity.call(this, 0, 0);

    this.health = 3;

    this.inventory = new Inventory();

    this.jumpHeld = false;

    this.lastWallJump = 0;
    this.lastWallJumpDir = 0;

    this.standTicks = 0;

    this.noControlTicks = 0;

    this.ducking = false;

    this.initiate = function() {
        this.heightOrigin = 1.6;
        this.width = 0.9;
        this.height = 1.6;

        this.inventory.items.push(new Item("tommygun", getLoadedImage("assets/icon/tommygun.png")));
        this.inventory.items.push(new Item("goldkey", getLoadedImage("assets/icon/goldkey.png")));

        this.runSpeed = 4;
        this.gravity = 4;
        this.jumpPower = 4.1; //4.5

        this.xDecrease = scl / 30;
        this.xDecreaseGround = scl / 15;
        this.yDecrease = scl / 100;

        this.controlCamera = true;

        var standAni = new Animation("stand");
        standAni.addFrame(getLoadedImage("assets/player/default/stand0.png"), 7);
        standAni.addFrame(getLoadedImage("assets/player/default/stand1.png"), 13);
        this.sprite.addAnimation(standAni);

        var duckAni = new Animation("duck");
        duckAni.addFrame(getLoadedImage("assets/player/default/duck0.png"), 10);
        this.sprite.addAnimation(duckAni);

        var idleAni = new Animation("idle");
        idleAni.addFrame(getLoadedImage("assets/player/default/idle0.png"), 7);
        idleAni.addFrame(getLoadedImage("assets/player/default/idle1.png"), 13);
        this.sprite.addAnimation(idleAni);

        var runAni = new Animation("run");
        runAni.addFrame(getLoadedImage("assets/player/default/run0.png"), 4);
        runAni.addFrame(getLoadedImage("assets/player/default/run1.png"), 4);
        runAni.addFrame(getLoadedImage("assets/player/default/run2.png"), 4);
        runAni.addFrame(getLoadedImage("assets/player/default/run3.png"), 4);
        runAni.addFrame(getLoadedImage("assets/player/default/run4.png"), 4);
        this.sprite.addAnimation(runAni);

        var jumpAni = new Animation("jump");
        jumpAni.addFrame(getLoadedImage("assets/player/default/jump0.png"), 7);
        jumpAni.addFrame(getLoadedImage("assets/player/default/jump1.png"), 7);
        jumpAni.addFrame(getLoadedImage("assets/player/default/jump2.png"), 7);
        jumpAni.addFrame(getLoadedImage("assets/player/default/jump3.png"), 12);
        this.sprite.addAnimation(jumpAni);

        var airAni = new Animation("air");
        airAni.addFrame(getLoadedImage("assets/player/default/air0.png"), 10);
        this.sprite.addAnimation(airAni);

        var wallAni = new Animation("wall");
        wallAni.addFrame(getLoadedImage("assets/player/default/wall0.png"), 1);
        this.sprite.addAnimation(wallAni);

        this.sprite.setFlipped(true);
    }

    this.initiate();

    this.playerTick = function() {
        if ((down && this.isOnGround()) || map.collisionRect(this.x, this.y, this.width * scl, this.heightOrigin * scl)) {
            this.sprite.setAnimation("duck");
            this.height = this.heightOrigin / 2;

            this.ducking = true;
            return;
        } else {
            this.height = this.heightOrigin;

            this.ducking = false;
        }

        if (!this.isOnGround() && ((this.isOnLeftWall() || this.isOnRightWall())
        && this.lastWallJump != this.blockAtHead().x) && this.distanceToGround() > 1) {
            if (this.velocity.y <= -3 && (this instanceof Player) && !down) {
                this.velocity.y = -3;
                this.sprite.playAnimation("wall");
            }
        }

        if (this.noControlTicks > 0)
            this.noControlTicks--;

        if (this.isOnGround()) {
            this.lastWallJump = 0;
        }

        if (!up)
            this.jumpHeld = false;

        if (this.sprite.isFlipped())
            if (this.velocity.x > 0)
                this.sprite.setFlipped(false);

        if (!this.sprite.isFlipped())
            if (this.velocity.x < 0)
                this.sprite.setFlipped(true);

        if (this.isOnGround() && this.sprite.currentAnimation().name != "crouch") {
            this.sprite.skipAnimation();

            if (this.velocity.x == 0) {
                if (this.standTicks > 0) {
                    this.sprite.setAnimation("stand");
                    this.standTicks--;
                } else {
                    this.sprite.setAnimation("idle");
                }
            }
            else
                this.sprite.setAnimation("run");
        } else
            this.sprite.setAnimation("air");
    }

    this.moveLeft = function() {
        if (this.ducking && this.isOnGround())
            return;

        if (this.noControlTicks > 0 && this.lastWallJumpDir == 1)
            return;

        if (!this.isOnLeftWall())
            this.velocity.x = -(scl * canvasWidth / 500 * this.runSpeed);

        this.standTicks = 50;
    }

    this.moveRight = function() {
        if (this.ducking && this.isOnGround())
            return;

        if (this.noControlTicks > 0 && this.lastWallJumpDir == 2)
            return;

        if (!this.isOnRightWall())
            this.velocity.x = (scl * canvasWidth / 500 * this.runSpeed);

        this.standTicks = 50;
    }

    this.jump = function() {
        if (this.noControlTicks > 0)
            return;

        if (this.isOnGround() && !map.collisionRect(this.x, this.y, this.width * scl, this.heightOrigin * scl)) {
            this.y++;
            this.velocity.y = scl * canvasHeight / 200 * this.jumpPower;

            this.jumpHeld = true;

            this.sprite.playAnimation("jump");


        } else if ((this.isOnLeftWall() || this.isOnRightWall()) && !this.jumpHeld && this.distanceToGround() > 1 && this.velocity.y <= 0 && this.lastWallJump != this.blockAtHead().x) {

            this.velocity.y = scl * canvasHeight / 200 * this.jumpPower;

            if (this.isOnLeftWall()) {
                this.velocity.x = scl * canvasHeight / 200 * this.jumpPower;
                this.lastWallJumpDir = 1;
            }
            else if (this.isOnRightWall()) {
                this.velocity.x = -(scl * canvasHeight / 200 * this.jumpPower);
                this.lastWallJumpDir = 2;
            }

            this.jumpHeld = true;

            this.sprite.playAnimation("jump");

            this.lastWallJump = this.blockAtHead().x;
            this.noControlTicks = 10;
        }
    }
}
Player.prototype = new Entity();

function Player(x, y) {
    Entity.call(this, x, y);

    this.initiate = function() {
        this.heightOrigin = 1.6;
        this.width = 0.9;
        this.height = 1.6;

        this.runSpeed = 4;
        this.gravity = 4;
        this.jumpPower = 4; //4.5

        this.xDecrease = scl / 30;
        this.xDecreaseGround = scl / 15;
        this.yDecrease = scl / 100;

        this.controlCamera = true;

        var standAni = new Animation("stand");
        standAni.addFrame(getLoadedImage("assets/player/default/stand0.png"), 7);
        standAni.addFrame(getLoadedImage("assets/player/default/stand1.png"), 13);
        this.sprite.addAnimation(standAni);

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

        this.sprite.setFlipped(true);
    }

    this.initiate();

    this.playerTick = function() {
        if (down && this.isOnGround()) {
            this.height = 1;
            this.sprite.playAnimation("crouch");
        }
        else
            this.height = this.heightOrigin;

        if (this.sprite.isFlipped())
            if (this.velocity.x > 0)
                this.sprite.setFlipped(false);

        if (!this.sprite.isFlipped())
            if (this.velocity.x < 0)
                this.sprite.setFlipped(true);

        if (this.isOnGround() && this.sprite.currentAnimation().name != "crouch") {
            this.sprite.skipAnimation();

            if (this.velocity.x == 0)
                this.sprite.setAnimation("stand");
            else
                this.sprite.setAnimation("run");
        } else
            this.sprite.setAnimation("air");
    }

    this.moveLeft = function() {
        if (!this.isOnLeftWall())
            this.velocity.x = -(scl * canvasWidth / 500 * this.runSpeed);
    }

    this.moveRight = function() {
        if (!this.isOnRightWall())
            this.velocity.x = (scl * canvasWidth / 500 * this.runSpeed);
    }

    this.jump = function() {
        if (this.isOnGround()) {
            this.y++;
            this.velocity.y = scl * canvasHeight / 200 * this.jumpPower;

            this.sprite.playAnimation("jump");
        }
    }
}
Player.prototype = new Entity();

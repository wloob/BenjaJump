function Entity(x, y) {
    this.x = x;
    this.y = y;

    this.sprite = new Sprite();

    this.width = 1;
    this.height = 1;

    this.velocity = new p5.Vector(0, 0);

    this.runSpeed = 1;
    this.gravity = 1;
    this.jumpPower = 1;

    this.xDecrease = scl / 30;
    this.xDecreaseGround = scl / 15;
    this.yDecrease = scl / 100;

    this.controlCamera;

    this.initiate = function() {
        //Setting child entity values
        //console.log("parent init");
    }

    this.entityTick = function(){}

    this.tick = function() {
        if (scl != oldScl)
            return;

        this.sprite.tick();

        movecheck: if (this.velocity.x > 0) {
            if (this.isOnRightWall()) {
                this.velocity.x = 0;
                break movecheck;
            }
            if (this.isOnGround())
                this.velocity.x -= this.xDecreaseGround;
            else
                this.velocity.x -= this.xDecrease;
            this.velocity.x = constrain(this.velocity.x, 0, Number.POSITIVE_INFINITY);
        } else if (this.velocity.x < 0) {
            if (this.isOnLeftWall()) {
                this.velocity.x = 0;
                break movecheck;
            }
            if (this.isOnGround())
                this.velocity.x += this.xDecreaseGround;
            else
                this.velocity.x += this.xDecrease;
            this.velocity.x = constrain(this.velocity.x, Number.NEGATIVE_INFINITY, 0);
        }

        if (this.isOnGround()) {
            this.velocity.y = 0;
        } else {
            if (down)
                this.velocity.y -= (this.yDecrease / 2.5 * this.gravity) * 2;
            else if (up && this.velocity.y > 0)
                this.velocity.y -= (this.yDecrease / 2.5 * this.gravity) * 0.55;
            else
                this.velocity.y -= this.yDecrease / 2.5 * this.gravity;
        }

        if (this.isOnCeiling()) {
            this.y--;
            this.velocity.y = 0;
        }

        //COLLISION CHECK
        while (map.collisionRect(this.x + this.velocity.x, this.y + this.velocity.y, this.width * scl, this.height * scl)) {
            //VERTICALLY
            while (map.collisionRect(this.x, this.y + this.velocity.y, this.width * scl, this.height * scl)) {
                if (this.velocity.y > 0) {
                    this.velocity.y--;
                    if (this.velocity.y < 0)
                        this.velocity.y = 0;
                } else if (this.velocity.y < 0) {
                    this.velocity.y++;
                    if (this.velocity.y > 0)
                        this.velocity.y = 0;
                }

            }

            //HORIZONTAL
            while (map.collisionRect(this.x + this.velocity.x, this.y, this.width * scl, this.height * scl)) {
                if (this.velocity.x > 0) {
                    this.velocity.x--;
                    if (this.velocity.x < 0)
                        this.velocity.x = 0;
                } else if (this.velocity.x < 0) {
                    this.velocity.x++;
                    if (this.velocity.x > 0)
                        this.velocity.x = 0;
                }

            }

            //STRAIGHT
            while (map.collisionRect(this.x + this.velocity.x, this.y + this.velocity.y, this.width * scl, this.height * scl)) {
                if (this.velocity.x > 0) {
                    this.velocity.x--;
                    if (this.velocity.x < 0)
                        this.velocity.x = 0;
                } else if (this.velocity.x < 0) {
                    this.velocity.x++;
                    if (this.velocity.x > 0)
                        this.velocity.x = 0;
                }
                if (this.velocity.y > 0) {
                    this.velocity.y--;
                    if (this.velocity.y < 0)
                        this.velocity.y = 0;
                } else if (this.velocity.y < 0) {
                    this.velocity.y++;
                    if (this.velocity.y > 0)
                        this.velocity.y = 0;
                }
            }
        }

        if (this.controlCamera && this.velocity.x < 0 && this.x < width / 3) {
            this.x += this.velocity.x - map.moveStart(this.velocity.x);
        } else if (this.controlCamera && this.velocity.x > 0 && this.x > width / 3 * 2) {
            this.x += this.velocity.x - map.moveStart(this.velocity.x);
        }
        else
            this.x += this.velocity.x;
        this.y += this.velocity.y;

        /*
        var minX = 0;
        if (map.leftBorder)
            minX = Number.MIN_VALUE;

        var maxX = map.width() * scl - this.width * scl;
        if (map.rightBorder)
            minX = Number.MAX_VALUE;
        */

        var minY = 0;
        if (map.buttomBorder)
            minY = Number.MIN_VALUE;

        var maxY = map.height() * scl - this.height * scl;
        if (map.topBorder)
            maxY = Number.MAX_VALUE;

        this.x = constrain(this.x, 0, map.width() * scl - this.width * scl);
        if (this.y >= 0)
        this.y = constrain(this.y, minY, maxY);


        console.log("x=" + this.x + ", xStart=" + map.xStart + "  = " + (this.x + map.xStart) / scl);

        if (this.y > map.height() * scl - this.height * scl && map.getLink("up", (this.x + map.xStart) / scl) != null) {
            var link = map.getLink("up", (this.x + map.xStart) / scl);

            map.initiate(link.name);
            this.x = link.x * scl;
            this.y = link.y * scl + 1;
        }

        else if (this.y < 0 && map.getLink("down", (this.x + map.xStart) / scl) != null) {
            var link = map.getLink("down", (this.x + map.xStart) / scl);

            map.initiate(link.name);
            this.x = link.x * scl;
            this.y = link.y * scl + 1;
        }

        else if (this.x < 0 && map.getLink("left", this.y / scl) != null) {
            var link = map.getLink("left", this.x / scl);

            map.initiate(link.name);
            this.x = link.x * scl;
            this.y = link.y * scl + 1;
        }

        else if (this.x > map.width() * scl - this.width * scl && map.getLink("right", this.y / scl) != null) {
            var link = map.getLink("right", this.y / scl);

            map.initiate(link.name);
            this.x = link.x * scl;
            this.y = link.y * scl + 1;
        }
    }

    this.isOnGround = function() {
        if (this.y <= 0 && map.buttomBorder)
            return true;

        else if (map.collision(this.x, this.y - 1) || map.collision(this.x + this.width * scl - 1, this.y - 1) || map.collision(this.x + this.width / 2 * scl - 1, this.y - 1))
            return true;

        return false;
    }

    this.isOnCeiling = function() {
        if (map.topBorder)
            return this.y + this.height * scl >= canvasHeight * scl;
        return false;
    }

    this.isOnLeftWall = function() {
        return this.x <= 0;
    }

    this.isOnRightWall = function() {
        return this.x + this.width * scl >= canvasWidth * scl;
    }

    this.scale = function() {
        this.x = scl / oldScl * this.x;
        this.y = scl / oldScl * this.y;
        this.velocity.x = scl / oldScl * this.velocity.x;
        this.velocity.y = scl / oldScl * this.velocity.y;
        this.xDecrease = scl / oldScl * this.xDecrease;
        this.xDecreaseGround = scl / oldScl * this.xDecreaseGround;
        this.yDecrease = scl / oldScl * this.yDecrease;
    }

    this.show = function() {
        this.sprite.show(this.x, this.y, this.width * scl, this.height * scl);
    }
}

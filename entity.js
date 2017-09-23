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
            //console.log("collision at (" + this.x + ";" + this.y + ") + (" + this.velocity.x + ";" + this.velocity.y + ") at scale: " + scl);

            //VERTICALLY
            while (map.collisionRect(this.x, this.y + this.velocity.y, this.width * scl, this.height * scl)) {
                //console.log("collision at velY: " + this.velocity.y);
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
                //console.log("collision at velX: " + this.velocity.x);
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
                //console.log("collision at velX: " + this.velocity.x + ", velY=" + this.velocity.y);

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

        if (this.controlCamera && this.velocity.x > 0 && this.x > width / 3 * 2)
            map.moveStart(this.velocity.x);
        else if (this.controlCamera && this.velocity.x < 0 && this.x - map.xStart < width / 3)
            map.moveStart(this.velocity.x);

        this.x += this.velocity.x;
        this.y += this.velocity.y;


        var minX = 0;
        if (map.leftBorder != true)
            minX = -Number.MAX_VALUE;

        var maxX = map.width() - this.width * scl;
        if (map.rightBorder != true)
            maxX = Number.MAX_VALUE;

        var minY = 0;
        if (map.buttomBorder != true)
            minY = -Number.MAX_VALUE;

        var maxY = map.height() - this.height * scl;
        if (map.topBorder != true)
            maxY = Number.MAX_VALUE;


        this.x = constrain(this.x, minX, maxX);   //RETURNEREDE MIN VÆRDI NÅR NEGATIV
        this.y = constrain(this.y, minY, maxY);


        //LINK CHECK
        if (this.y - this.height * scl > map.height() - this.height * scl && map.getLink("up", this.x / scl) != null) {
            var link = map.getLink("up", this.x / scl);

            this.x = link.x * scl;
            this.y = link.y * scl + 1;
            map.initiate(link.name);
        }

        else if (this.y + this.height * scl < 0 && map.getLink("down", this.x / scl) != null) {
            var link = map.getLink("down", this.x / scl);

            this.x = link.x * scl;
            this.y = link.y * scl + 1;
            map.initiate(link.name);
        }

        else if (this.x + this.width * scl < 0 && map.getLink("left", this.y / scl) != null) {
            var link = map.getLink("left", this.y / scl);

            this.x = link.x * scl;
            this.y = link.y * scl + 1;
            map.initiate(link.name);
        }

        else if (this.x - this.width * scl > map.width() - this.width * scl && map.getLink("right", this.y / scl) != null) {
            var link = map.getLink("right", this.y / scl);

            this.x = link.x * scl;
            this.y = link.y * scl + 1;
            map.initiate(link.name);
        }
    }

    this.isOnGround = function() {
        if (map.buttomBorder == true && this.y <= 0)
            return true;

        else if (map.collision(this.x, this.y - 1) || map.collision(this.x + this.width * scl - 1, this.y - 1) || map.collision(this.x + this.width / 2 * scl - 1, this.y - 1))
            return true;

        return false;
    }

    this.isOnCeiling = function() {
        return map.topBorder == true && this.y + this.height * scl >= map.height();
    }

    this.isOnLeftWall = function() {
        return map.leftBorder == true && this.x <= 0;
    }

    this.isOnRightWall = function() {
        return map.rightBorder == true && this.x + this.width * scl >= map.width();
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
        this.sprite.show(this.x - map.xStart, this.y, this.width * scl, this.height * scl);
    }
}

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

        this.movementTick();

        this.gravityTick();



        this.collisionCheck();

        //this.collisionCheck();
        //console.log("colcheck");

        if (!sameBlock(this.blockAtFeet(), this.blockAtFeet(this.velocity.x, this.velocity.y)) ||
        !sameBlock(this.blockAtHead(), this.blockAtHead(this.velocity.x, this.velocity.y))) {
            this.collisionCheck();
        } //Entered new block!

        if (this.controlCamera)
            this.updateCamera();

        this.updatePosition();

        this.linkCheck();
    }

    this.movementTick = function() {
        if (this.velocity.x > 0) {
            if (this.isOnRightWall()) {
                this.velocity.x = 0;
                return;
            }
            if (this.isOnGround())
                this.velocity.x -= this.xDecreaseGround;
            else
                this.velocity.x -= this.xDecrease;
            this.velocity.x = constrain(this.velocity.x, 0, Number.POSITIVE_INFINITY);
        } else if (this.velocity.x < 0) {
            if (this.isOnLeftWall()) {
                this.velocity.x = 0;
                return;
            }
            if (this.isOnGround())
                this.velocity.x += this.xDecreaseGround;
            else
                this.velocity.x += this.xDecrease;
            this.velocity.x = constrain(this.velocity.x, Number.NEGATIVE_INFINITY, 0);
        }
    }

    this.gravityTick = function() {
        if (!this.isOnGround()) {
            if (down && this instanceof Player)
                this.velocity.y -= (this.yDecrease / 2.5 * this.gravity) * 2;
            else if (up && this.velocity.y > 0 && this instanceof Player)
                this.velocity.y -= (this.yDecrease / 2.5 * this.gravity) * 0.55;
            else
                this.velocity.y -= this.yDecrease / 2.5 * this.gravity;
        } else {
            this.velocity.y = 0;
        }


        if (this instanceof Player && !this.isOnGround() && (this.isOnLeftWall() || this.isOnRightWall()) && this.distanceToGround() > 0.5) {
            if (this.velocity.y <= -3 && (this instanceof Player) && !down) {
                this.velocity.y = -3;
                this.sprite.playAnimation("wall");
            }
        }

        if (this.velocity.y < -scl / 2)
            this.velocity.y = -scl / 2;

        if (this.isOnCeiling()) {
            this.y--;
            this.velocity.y = 0;
        }
    }

    this.collisionCheck = function() {

        if (sameBlockList(map.getBlocksAtRect(this.x, this.y, this.width * scl, this.height * scl),
        map.getBlocksAtRect(this.x + this.velocity.x, this.y + this.velocity.y, this.width * scl, this.height * scl))) {
            return; //no change in blocks
        }

        //VERTICAL
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

    this.updateCamera = function() {
        if (this.velocity.x > 0 && this.x > width / 3 * 2)
            map.moveStart(this.velocity.x, 0);
        else if (this.velocity.x < 0 && this.x - map.xStart < width / 3)
            map.moveStart(this.velocity.x, 0);


        map.setStartY((this.y + this.height / 2) - height / 2);
    }

    this.updatePosition = function() {
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


        this.x = constrain(this.x, minX, maxX);
        this.y = constrain(this.y, minY, maxY);
    }

    this.linkCheck = function() {
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

        else if (map.collision(this.x, this.y - 1)
         || map.collision(this.x + this.width * scl - 1, this.y - 1)
         || map.collision(this.x + this.width / 2 * scl - 1, this.y - 1))
            return true;

        return false;
    }

    this.isOnCeiling = function() {
        if (map.topBorder == true && this.y + this.height * scl >= map.height())
            return true;

        else if (map.collision(this.x, this.y + this.height * scl)
         || map.collision(this.x + this.width * scl / 2, this.y + this.height * scl)
         || map.collision(this.x + this.width * scl - 1, this.y + this.height * scl))
            return true;

        return false;
    }

    this.isOnLeftWall = function() {
        if (map.leftBorder == true && this.x <= 0)
            return true;

        else if (map.collision(this.x - 1, this.y)
         || map.collision(this.x - 1, this.y + this.height * scl / 2)
         || map.collision(this.x - 1, this.y + this.height * scl - 1))
            return true;

        return false;
    }

    this.isOnRightWall = function() {
        if (map.rightBorder == true && this.x + this.width * scl >= map.width())
            return true;

        else if (map.collision(this.x + this.width * scl, this.y)
         || map.collision(this.x + this.width * scl, this.y + this.height * scl / 2)
         || map.collision(this.x + this.width * scl, this.y + this.height * scl - 1))
            return true;

        return false;
    }

    this.distanceToGround = function() {
        if (this.isOnGround())
            return 0;
        else {
            var i = 0;
            while(!map.collisionRect(this.x, this.y - i, this.width, this.height) && this.y - i > 0) {
                i++;
            }

            return i / scl;
        }
    }

    this.blockAtFeet = function(addedX = 0, addedY = 0) {
        return map.getBlockAt(this.x + addedX + this.width / 2 - 1, this.y + addedY);
    }

    this.blockAtHead = function(addedX = 0, addedY = 0) {
        return map.getBlockAt(this.x + addedX + this.width / 2 - 1, this.y + addedY + this.height - 1);
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
        this.sprite.show(Math.floor(this.x - map.xStart), Math.floor(this.y - map.yStart), this.width * scl, this.height * scl);
    }
}

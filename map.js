function Map() {
    this.xStart = 0;

    this.tileColumns = {};

    this.setTile = function(x, y, id) {
        this.tileColumns[x][y] = id;
    }

    this.draw = function() {
        for (c = Math.floor(this.xStart / scl); c < this.tileColumns.length; c++) {
            for (r = 0; r < this.tileColumns[c].length; r++) {
                if (this.tileColumns[c][r] === 0)
                    continue;

                image(getTileImg(this.tileColumns[c][r]), c * scl - this.xStart, height - r * scl - scl, scl, scl);
            }
        }
    }

    this.scale = function() {
        this.xStart = scl / oldScl * this.xStart;
    }

    this.width = function() {
        return this.tileColumns.length;
    }

    this.height = function() {
        return this.tileColumns[0].length;
    }

    this.moveStart = function(added) {
        if (added < 0 && this.xStart + added >= 0) {
            this.xStart+=added;
            return added;
        }

        else if (added > 0 && this.xStart + added < (this.tileColumns.length - canvasWidth) * scl) { // total mulig - aktuel
            this.xStart+=added;
            return added;
        }
        return 0;
    }

    this.collision = function(x, y) {
        if (x <= 0 || y <= 0)
            return false;

        if (Math.floor((x + this.xStart - 10) / scl) >= this.tileColumns.length) {
            return true;
        }

        if (Math.floor(x + this.xStart) / scl >= this.tileColumns.length) { //For tæt på slutvæggen
            return this.tileColumns[Math.floor((x + this.xStart - 10) / scl)][Math.floor(y / scl)] != 0;
        } else
            return this.tileColumns[Math.floor((x + this.xStart) / scl)][Math.floor(y / scl)] != 0;
    }

    this.collisionRect = function(x, y, width, height) {
        //CORNERS
        if (this.collision(x, y) || this.collision(x, y + height - 1) || this.collision(x + width - 1, y + height - 1) || this.collision(x + width - 1, y))
            return true;

        //SIDES
        if (this.collision(x + 0.5 * width, y) || this.collision(x + 0.5 * width, y + height - 1) || this.collision(x, y + 0.5 * height) || this.collision(x + width - 1, y + 0.5 * height))
            return true;
    }

    this.initiate = function(folderName) {
        this.tileColumns = new Array(canvasWidth * 2);
        for (i = 0; i < this.tileColumns.length; i++) {
            this.tileColumns[i] = new Array(canvasHeight).fill(0);
        }

        //[COL][ROW]
    }
}

function getTileImg(id) {
    return getLoadedImage("assets/texture/rock0.png");
}

function setTile(x, y, id) {
    fill(66, 134, 244);
    rect(x * scl, (canvasHeight - y) * scl - scl, scl, scl);
}

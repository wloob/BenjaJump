var loadedMaps = new Array();

function addLoadedMap(name) {
    if (getLoadedImage(name) !== null) {
        return;
    }

    var file = loadJSON(host + mapPath + name + ".json");

    if (file !== null) {
        loadedMaps.push(new LoadedMap(name, file));
        return true;
    } else {
        console.log("Failed to load map: " + name);
        return false;
    }
}

function getLoadedMap(name) {
    for (i = 0; i < loadedMaps.length; i++) {
        if (loadedMaps[i].name.toLowerCase() === name.toLowerCase())
            return loadedMaps[i].file;
    }

    return null;
}

function LoadedMap(name, file) {
    this.name = name;
    this.file = file;
}


function sameBlock(block1, block2) {
    return block1.x == block2.x && block1.y == block2.y;
}

function sameBlockList(list1, list2) {
    if (list1.length != list2.length)
        return false;

    for (i = 0; i < list1.length; i++) {
        if (list1[i].x != list2[i].x || list1[i].y != list2[i].y)
            return false;
    }
    return true;
}


function Map() {
    this.file = null;

    this.tileColumns = {};
    this.name = "Map Name";
    this.spawnX = 0;
    this.spawnY = 0;
    this.backgroundImage = null;

    this.tileWidth = 30;
    this.tileHeight = 15;

    this.topBorder = true;
    this.buttomBorder = true;
    this.leftBorder = true;
    this.rightBorder = true;

    this.links = new Array();

    this.xStart = 0;
    this.yStart = 0;

    this.start = 0;

    this.setTile = function(x, y, id) {
        this.tileColumns[x][y] = id;
    }

    this.draw = function() {
        image(this.backgroundImage, 0, 0, width, height);

        for (c = Math.floor(this.xStart / scl); c < this.tileColumns.length; c++) {
            for (r = Math.floor(this.yStart / scl); r < this.tileColumns[c].length; r++) {
                if (this.tileColumns[c][r] === 0)
                    continue;

                if (getTileImg(Math.abs(this.tileColumns[c][r])) == null) {
                    continue;
                }

                image(getTileImg(Math.abs(this.tileColumns[c][r])), c * scl - Math.floor(this.xStart), height - r * scl - scl + Math.floor(this.yStart), scl, scl);
            }
        }
    }

    this.scale = function() {
        this.xStart = scl / oldScl * this.xStart;
        this.yStart = scl / oldScl * this.yStart;
    }

    this.width = function() {
        return this.tileColumns.length * scl;
    }

    this.height = function() {
        return this.tileColumns[0].length * scl;
    }

    this.moveStart = function(addedX, addedY) {
        if (addedX < 0 && this.xStart + addedX >= 0)
            this.xStart+=addedX;
        else if (addedX > 0 && this.xStart + addedX < (this.tileWidth - canvasWidth) * scl) // total mulig - aktuel
            this.xStart+=addedX;


        if (addedY < 0 && this.yStart + addedY >= 0)
            this.yStart+=addedY;
        else if (addedY > 0 && this.yStart + addedY < (this.tileHeight - canvasHeight) * scl) // total mulig - aktuel
            this.yStart+=addedY;
    }

    this.setStartY = function(y) {
        this.yStart = y;
        if (this.yStart < 0)
            this.yStart = 0;
        else if (this.yStart > this.height() - height)
            this.yStart = this.height() - height;
    }

    this.collision = function(x, y) {
        if (x < 0 || y < 0 || x > this.width() || y > this.height())
            return false;

        if (Math.floor((x - this.xStart) / scl) > this.tileColumns.length || Math.floor((y - this.yStart) / scl) > this.tileColumns.length)
            return false;

        if (this.getTileAt(x, y) == null)
            return false;

        return this.getTileAt(x, y).hitbox === true;
    }

    this.collisionRect = function(x, y, w, h) {
        //CORNERS
        if (this.collision(x, y)  || this.collision(x, y + h - 1) || this.collision(x + w - 1, y + h - 1) || this.collision(x + w - 1, y)) {
            return true;
        }

        //SIDES
        if (this.collision(x + 0.5 * w, y) || this.collision(x + 0.5 * w, y + h - 1) || this.collision(x, y + 0.5 * h) || this.collision(x + w - 1, y + 0.5 * h)) {
            return true;
        }
            return false;
    }

    this.getTileAt = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height() || isNaN(x) || isNaN(y)) {
            return getTile(0);
        }

        return getTile(this.tileColumns[Math.floor(x / scl)][Math.floor(y / scl)]);
    }

    this.getBlockAt = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height() || isNaN(x) || isNaN(y)) {
            return {x: -1, y: -1, id: 0};
        }

        return {x: Math.floor(x / scl), y: Math.floor(y / scl), id: this.tileColumns[Math.floor(x / scl)][Math.floor(y / scl)]};
    }

    this.getBlocksAtRect = function(x, y, w, h) {
        return [this.getBlockAt(x, y), this.getBlockAt(x, y + h - 1), this.getBlockAt(x + w - 1, y + h - 1), this.getBlockAt(x + w - 1, y)];
    }

    this.sameBlocksAt = function(x1, y1, x2, y2) {
        var block1 = this.getBlockAt(x1, y1);
        var block2 = this.getBlockAt(x2, y2);

        return block1.x == block2.x && block1.y == block2.y;
    }

    this.getLink = function(type, val) {
        if (this.links == null)
            return null;

        for (i = 0; i < this.links.length; i++) {
            if (this.links[i].type.toLowerCase() === type.toLowerCase() && val >= this.links[i].min && val <= this.links[i].max)
                return this.links[i].target;
        }

        return null;
    }

    this.initiate = function(mapName) {
        this.file = getLoadedMap(mapName);
        this.tileColumns = this.file.tiles;

        while (this.tileColumns.length < canvasWidth) {
            var empty = new Array(15);
            empty.fill(0);
            this.tileColumns.push(empty);
        }

        this.tileWidth = this.tileColumns.length;
        this.tileHeight = 0;
        for (i = 0; i < this.tileColumns.length; i++)
            if (this.tileColumns[i].length > this.tileHeight)
                this.tileHeight = this.tileColumns[i].length;

        this.name = this.file.name;

        this.spawnX = this.file.spawnX;
        this.spawnY = this.file.spawnY;

        this.backgroundImage = getLoadedImage(backgroundPath + this.file.background);

        this.topBorder = true;
        this.buttomBorder = true;
        this.leftBorder = true;
        this.rightBorder = true;

        if (this.file.topBorder != null)
            this.topBorder = this.file.topBorder;
        if (this.file.buttomBorder != null)
            this.buttomBorder = this.file.buttomBorder;
        if (this.file.leftBorder != null)
            this.leftBorder = this.file.leftBorder;
        if (this.file.rightBorder != null)
            this.rightBorder = this.file.rightBorder;

        this.links = this.file.links;

        this.start = this.file.start;

        this.xStart = player.x - (canvasWidth * scl / 2);

        if (this.xStart < 0)
            this.xStart = 0;

        if (this.xStart > (this.width() - canvasWidth * scl))
            this.xStart = (this.width() - canvasWidth * scl);


        this.yStart = 0;
        if (player.y >= canvasHeight * scl / 2) {
            this.yStart = player.y - canvasHeight * scl / 2;

            if (this.yStart > (this.height() - canvasHeight * scl))
                this.yStart = (this.height() - canvasHeight * scl);
        }

        player.lastWallJump = -1;
        player.lastWallDir = -1;
    }
}

function getTileImg(id) {
    if (getTile(id) != null)
        return getTile(id).img;
    return null;
}

function setTile(x, y, id) {
    fill(66, 134, 244);
    rect(x * scl, (canvasHeight - y) * scl - scl, scl, scl);
}

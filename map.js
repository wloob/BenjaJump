var loadedMaps = new Array();

function addLoadedMap(name) {
    if (getLoadedImage(name) !== null) {
        return;
    }

    var file = loadJSON(mapPath + name + ".json");
    if (file !== null) {
        loadedMaps.push(new LoadedMap(name, file));
        return true;
    }
    return false;
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

function Block(x, y) {
    this.x = x;
    this.y = y;
}


function Map() {
    this.file = null;

    this.tileColumns = {};
    this.name = "Map Name";
    this.spawnX = 0;
    this.spawnY = 0;
    this.backgroundImage = null;

    this.topBorder = true;
    this.buttomBorder = true;
    this.leftBorder = true;
    this.rightBorder = true;

    this.links = new Array();

    this.xStart = 0;

    this.setTile = function(x, y, id) {
        this.tileColumns[x][y] = id;
    }

    this.draw = function() {
        image(this.backgroundImage, 0, 0, width, height);

        for (c = Math.floor(this.xStart / scl); c < this.tileColumns.length; c++) {
            for (r = 0; r < this.tileColumns[c].length; r++) {
                if (this.tileColumns[c][r] === 0)
                    continue;

                image(getTileImg(Math.abs(this.tileColumns[c][r])), c * scl - Math.floor(this.xStart), height - r * scl - scl, scl, scl);
            }
        }
    }

    this.scale = function() {
        this.xStart = scl / oldScl * this.xStart;
    }

    this.width = function() {
        return this.tileColumns.length * scl;
    }

    this.height = function() {
        return this.tileColumns[0].length * scl;
    }

    this.moveStart = function(added) {
        if (added < 0 && this.xStart + added >= 0)
            this.xStart+=added;

        else if (added > 0 && this.xStart + added < (this.tileColumns.length - canvasWidth) * scl) // total mulig - aktuel
            this.xStart+=added;
    }

    this.collision = function(x, y) {
        if (x < 0 || y < 0)
            return false;

        if (Math.floor((x - this.xStart) / scl) > this.tileColumns.length || Math.floor(y / scl) > this.tileColumns.length)
            return false;

        return this.getBlockAt(x, y).id > 0;
    }

    this.collisionRect = function(x, y, w, h) {
        //CORNERS
        if (this.collision(x, y) || this.collision(x, y + h - 1) || this.collision(x + w - 1, y + h - 1) || this.collision(x + w - 1, y)) {
            return true;
        }

        //SIDES
        if (this.collision(x + 0.5 * w, y) || this.collision(x + 0.5 * w, y + h - 1) || this.collision(x, y + 0.5 * h) || this.collision(x + w - 1, y + 0.5 * h)) {
            return true;
        }
            return false;
    }

    this.getBlockAt = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height()) {
            return {x: -1, y: -1, id: 0};
        }


        return {x: Math.floor(x / scl), y: Math.floor(y / scl), id: this.tileColumns[Math.floor(x / scl)][Math.floor(y / scl)]};
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

        this.xStart = 0;
        if (player.x >= canvasWidth * scl / 2) {
            this.xStart = player.x - canvasWidth * scl / 2;

            if (this.xStart > (this.width() - canvasWidth * scl))
                this.xStart = (this.width() - canvasWidth * scl);
        }
    }
}

function getTileImg(id) {
    return getLoadedImage("assets/texture/tiles/" + id + ".png");
}

function setTile(x, y, id) {
    fill(66, 134, 244);
    rect(x * scl, (canvasHeight - y) * scl - scl, scl, scl);
}

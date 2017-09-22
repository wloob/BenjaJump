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

                image(getTileImg(Math.abs(this.tileColumns[c][r])), c * scl - this.xStart, height - r * scl - scl, scl, scl);
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
            return this.tileColumns[Math.floor((x + this.xStart - 10) / scl)][Math.floor(y / scl)] > 0;
        } else
            return this.tileColumns[Math.floor((x + this.xStart) / scl)][Math.floor(y / scl)] > 0;
    }

    this.collisionRect = function(x, y, width, height) {
        //CORNERS
        if (this.collision(x, y) || this.collision(x, y + height - 1) || this.collision(x + width - 1, y + height - 1) || this.collision(x + width - 1, y))
            return true;

        //SIDES
        if (this.collision(x + 0.5 * width, y) || this.collision(x + 0.5 * width, y + height - 1) || this.collision(x, y + 0.5 * height) || this.collision(x + width - 1, y + 0.5 * height))
            return true;
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
        this.topBorder = this.file.topBorder;
        this.buttomBorder = this.file.buttomBorder;
        this.leftBorder = this.file.leftBorder;
        this.rightBorder = this.file.rightBorder;
    }
}

function getTileImg(id) {
    return getLoadedImage("assets/texture/tiles/" + id + ".png");
}

function setTile(x, y, id) {
    fill(66, 134, 244);
    rect(x * scl, (canvasHeight - y) * scl - scl, scl, scl);
}

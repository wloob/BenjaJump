var tiles = new Array();

function getTile(id) {
    if (id === null || id < 0)
        return getTile(0);

    for (i = 0; i < tiles.length; i++) {
        if (tiles[i].id === id)
            return tiles[i];
    }
}

function Tile(info) {
    this.name = "null_name";
    this.id = -1;
    this.hitbox = true;
    this.friction = 1;
    this.img = null;

    if (info.name != null)
        this.name = info.name;
    if (info.id != null) {
        this.id = info.id;
        addLoadedImage(tilesPath + this.id + ".png");
        if (getLoadedImage(tilesPath + this.id + ".png") != null)
        this.img = getLoadedImage(tilesPath + this.id + ".png");
    }
    if (info.hitbox != null)
        this.hitbox = info.hitbox;
    if (info.friction != null)
        this.friction = info.friction;
}

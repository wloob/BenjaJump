var loadedImages = new Array();

function addLoadedImage(name) {
    if (getLoadedImage(name) !== null) {
        return;
    }

    var img = loadImage((useHost ? host : "") + name);
    console.log("Loading img' " + name + "' from host=" + useHost + ", success:");
    console.log(img !== null);

    if (img !== null)
        loadedImages.push(new LoadedImage(name, img));
    else {
        console.log("Failed to load image: " + name);
    }
}

function getLoadedImage(name) {
    for (i = 0; i < loadedImages.length; i++) {
        if (loadedImages[i].name.toLowerCase() === name.toLowerCase()) {
            return loadedImages[i].img;
        }
    }

    return null;
}

function LoadedImage(name, img) {
    this.name = name;
    this.img = img;
}


function Sprite() {
    this.animations = new Array();
    this.active = null;
    this.prev = null;

    this.flipped = false;

    this.show = function(x, y, w, h) {
        if (this.active === null || this.active.currentImage() == null)
            return;

        if (this.flipped) {
            scale(-1, 1);
            image(this.active.currentImage(), -1 * x - w, canvasHeight * scl - y - h, w, h);
        } else
        image(this.active.currentImage(), x, canvasHeight * scl - y - h, w, h);
    }

    this.addAnimation = function(ani) {
        this.animations.push(ani);

        if (this.animations.length === 1)
            this.active = this.animations[0];
    }

    this.setAnimation = function(name) {
        if (this.active !== null && this.active.name.toLowerCase() === name.toLowerCase()) {
            return;
        }

        if (this.getAnimation(name) === null) {
            return;
        }

        if (this.prev !== null) {
            this.prev.reset();
            this.prev = this.getAnimation(name);
            return;
        }

        if (this.active !== null)
            this.active.reset();

        if (name === null) {
            this.active = null;
            return;
        }

        for (i = 0; i < this.animations.length; i++) {
            if (this.animations[i].name.toLowerCase() === name.toLowerCase()) {
                this.active = this.animations[i];
                break;
            }
        }
    }

    this.playAnimation = function(name) {
        if (this.active !== null) {
            if (this.active.name.toLowerCase() === name.toLowerCase()) {
                this.active.reset();
                return;
            }
            this.prev = this.active;
        }

        for (i = 0; i < this.animations.length; i++) {
            if (this.animations[i].name.toLowerCase() === name.toLowerCase()) {
                this.active = this.animations[i];
                break;
            }
        }
    }

    this.skipAnimation = function() {
        if (this.prev == null)
            return;

        this.active.reset();
        this.active = this.prev;
        this.prev = null;
    }

    this.currentAnimation = function() {
        return this.active;
    }

    this.getAnimation = function(name) {
        for (i = 0; i < this.animations.length; i++) {
            if (this.animations[i].name.toLowerCase() === name.toLowerCase())
                return this.animations[i];
        }
        return null;
    }

    this.setFlipped = function(flipBool) {
        this.flipped = flipBool;
    }

    this.isFlipped = function() {
        return this.flipped;
    }

    this.tick = function() {
        if (this.active == null)
            return;

        if (this.active.tick()) {
            if (this.prev !== null) {
                this.active = this.prev;
                this.prev = null;
            }
        }
    }
}

function Animation(name) {
    this.name = name;
    this.frames = new Array();
    this.currentIndex = 0;

    this.currentFrame = function() {
        if (this.frames.length > 0)
            return this.frames[this.currentIndex];
        return null;
    }

    this.currentImage = function() {
        if (this.frames.length > 0)
            return this.frames[this.currentIndex].img;
        return null;
    }

    this.reset = function() {
        this.currentIndex = 0;
    }

    this.tick = function() {
        if (this.frames.length < 1)
            return false;

        if (this.currentFrame().tick()) {
            this.currentIndex++;

            if (this.currentIndex >= this.frames.length) {
                this.currentIndex = 0;
                return true;
            }
        }
        return false;
    }

    this.addFrame = function(img, ticks) {
        if (img !== null)
            this.frames.push(new Frame(img, ticks));
    }
}

function Frame(img, ticks) {
    this.img = img;
    this.duration = ticks;
    this.ticks = ticks;

    this.tick = function() {
        this.ticks--;

        if (this.ticks <= 0) {
            this.ticks = this.duration;
            return true;
        }
        return false;
    }
}

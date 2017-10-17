function Inventory() {
    this.items = [];

    this.hasItem = function(name) {
        for (i = 0; i < items.length; i++) {
            if (items[i].name.toLowerCase() === name.toLowerCase())
                return true;
        }
        return false;
    }
}

function Item(name, img) {
    this.name = name;
    this.img = img;
}

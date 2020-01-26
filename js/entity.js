console.log("Loaded entity.js")

class Entity {
    sprite;
    constructor(app, sprite, x, y) {
        this.sprite = new Sprite(sprite);
        this.sprite.x = x;
        this.sprite.y = y;
        app.stage.addChild(this.sprite);
    }

    /**
     * Returns position of the Entity's sprite as {x,y}
     */
    get getPos() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    /**
     * Sets the x y coordinates of the sprite
     * @param {Integer} x 
     * @param {Integer} y 
     */
    setPos(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    /**
     * Adds the passed values to the x y coordinates of the sprite
     * @param {Integer} x 
     * @param {Integer} y 
     */
    add(x, y) {
        this.sprite.x += x;
        this.sprite.y += y;
    }

    /**
     * Toggles the visible state of the entity's sprite
     */
    showHide() {
        this.sprite.visible = !this.sprite.visible;
    }
}
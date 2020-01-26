class Robot {
    sprite;
    constructor(app, sprite, x, y) {
        this.sprite = new Sprite(sprite);
        this.sprite.x = x;
        this.sprite.y = y;
        app.stage.addChild(this.sprite);
    }

    /**
     * Returns position of the Robot's sprite as {x,y}
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
     * Moves robot in direction dir by 32 pixels, to conform to the grid
     * @param {string} dir - n e w s
     */
    move(dir) {
        switch(dir) {
            case "n":
                this.add(0, -32);
                console.log("Moving north");
                break;
            case "e":
                this.add(32, 0);
                console.log("Moving east");
                break;
            case "w":
                this.add(-32, 0);
                console.log("Moving west");
                break;
            case "s":
                this.add(0,32);
                console.log("Moving south");
                break;
            default:
                console.log("Invalid direction")
        }
    }

    /**
     * Toggles the visible state of the Robot's sprite
     */
    showHide() {
        this.sprite.visible = !this.sprite.visible;
    }
}
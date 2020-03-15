console.log("Loaded entity.js")

class Entity {
    sprite;
    name = "";
    displayName = "";
    constructor(container, sprite, name, displayName, x, y) {
        this.sprite = new Sprite(sprite);
        this.name = name;
        this.displayName = displayName;
        this.sprite.x = x;
        this.sprite.y = y;
        container.addChild(this.sprite);
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

    get getCenter() {
        return {
            x: this.sprite.x + (this.sprite.width / 2),
            y: this.sprite.y + (this.sprite.height / 2)
        }
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

    samePosition(other) {
        return (this.getPos.x === other.getPos.x) && (this.getPos.y === other.getPos.y)
    }
}

/**
 * Returns true if the attempted x/y coordinate pair is free of any entities
 * @param {array} entities 
 * @param {Object} pos
 */
function notColliding(entities, pos) {
    for (e in entities) {
        let entity = entities[e];
        if (entity.getPos.x === pos.x && entity.getPos.y === pos.y) {
            return false;
        }
    }
    return true;
}

/**
 * Returns true if the x/y coordinate pair is within the bounds of the app view
 * @param {Object} pos  - x/y coordinate object
 */
function inBounds(pos) {
    if (pos.x > director.board.width)    {return false}
    if (pos.x < director.board.x)    {return false}
    if (pos.y > director.board.height)    {return false}
    if (pos.y < director.board.y)    {return false}
    return true;
}

/**
 * Returns an array of entities found within the passed Array at the passed coordinate point
 * @param {Object} entities 
 * @param {Object} pos - x/y coordinate object
 */
function getEntitiesAt(entities, pos) {
    let ret = {};
    let index = 0;
    for (e in entities) {
        let entity = entities[e];
        if (entity.getPos.x === pos.x && entity.getPos.y === pos.y) {
            ret[index] = entity;
            index++;
        }
    }
    if (index === 0){
        return null;
    }
    else {
        return ret;
    }
}
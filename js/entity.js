console.log("Loaded entity.js")

class Entity {
    sprite;
    name = "";
    constructor(container, sprite, name, x, y) {
        this.sprite = new Sprite(sprite);
        this.name = name;
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
    if (pos.x > app.view.width - 32)    {return false}
    if (pos.x < 0)                      {return false}
    if (pos.y > app.view.height - 64)   {return false}
    if (pos.y < 0)                      {return false}
    return true;
}

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
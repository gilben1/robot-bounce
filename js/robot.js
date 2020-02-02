console.log("Loaded robot.js")
class Robot extends Entity {
    constructor(container, sprite, name, x, y) {
        // store self to pass onto click events to refer to this object
        let self = super(container, sprite, name, x, y); 
        this.sprite.on('mousedown', function(e) {
            robotSelect(e, self);
        });
        this.sprite.interactive = true;
    }

    /**
     * Moves robot in direction dir by 32 pixels, to conform to the grid
     * @param {string} dir - n e w s
     */
    move(dir) {
        let north = {x: this.sprite.x, y: this.sprite.y - 32};
        let south = {x: this.sprite.x, y: this.sprite.y + 32};
        let east = {x: this.sprite.x + 32, y: this.sprite.y};
        let west = {x: this.sprite.x - 32, y: this.sprite.y};

        // If there's a wall at this tile, resolve it before continuing
        let localWalls = getEntitiesAt(walls, this.getPos);
        for (let w in localWalls) {
            if (localWalls[w] !== null && localWalls[w].collides(dir)) {
                return false;
            }
        }

        switch(dir) {
            case "n":
                if (notColliding(robots, north) && inBounds(north)) {
                    this.add(0, -32);
                    console.log("Moving north");
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "e":
                if (notColliding(robots, east) && inBounds(east)) {
                    this.add(32, 0);
                    console.log("Moving east");
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "w":
                if (notColliding(robots, west) && inBounds(west)) {
                    this.add(-32, 0);
                    console.log("Moving west");
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "s":
                if (notColliding(robots, south) && inBounds(south)) {
                    this.add(0,32);
                    console.log("Moving south");
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            default:
                console.log("Invalid direction");
                return false;
        }
    }

    wallAtCurrentPos() {
        for (w in walls) {
            let wall = walls[w];
            if (wall.getPos == this.getPos) {
                return wall;
            }
        }
        return null
    }

    atCorrectTarget(target) {
        let targetColor = target.name[target.name.length - 1];
        let thisColor = this.name[0];
        return (thisColor === targetColor || targetColor === 'w') && this.samePosition(target);
    }
}

/**
 * Assigns the robot that triggers this callback as the active robot
 * @param {event} eventData 
 * @param {Robot} self 
 */
function robotSelect(eventData, self) {
    activeText.text = self.name;
    activeRobot = self;
}
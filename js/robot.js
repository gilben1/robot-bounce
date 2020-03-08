console.log("Loaded robot.js")

/**
 * Global variables pertaining to Robots
 */

class Robot extends Entity {
    checkpoint
    constructor(container, sprite, name, displayName, x, y) {
        // store self to pass onto click events to refer to this object
        super(container, sprite, name, displayName, x, y); 
        this.sprite.on('mousedown', (e) => {
            director.activeRobot = this;
        })
        this.sprite.interactive = true;
        this.checkpoint = {
            x: x,
            y: y
        }
    }

    /**
     * Moves robot in direction dir by 32 pixels, to conform to the grid
     * @param {string} dir - n e w s
     */
    move(dir, robots, walls) {
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

    /**
     * Returns true if the passed target matches this Robot's color
     * @param {Target} target 
     */
    atCorrectTarget(target) {
        let targetColor = target.name[target.name.length - 1];
        let thisColor = this.name[0];
        return (thisColor === targetColor || targetColor === 'w') && this.samePosition(target);
    }

    /**
     * Return to the last saved position
     */
    rewind(){
        this.setPos(this.checkpoint.x, this.checkpoint.y);
    }

    /**
     * Updates the saved position to the current position
     */
    updateCheckpoint() {
        this.checkpoint = { 
            x: this.getPos.x,
            y: this.getPos.y
        }
    }
}

/**
 * Move to the passed direction until a wall or other obstacle is hit
 * @param {string} dir 
 */
function robotMove(dir, activeRobot, scoreBoard, walls, robots) {
    if (activeRobot !== undefined) {
        let moves = 0;
        while(activeRobot.move(dir, robots, walls)) { moves++; }
        // If the loop actually moved the robot, add to the move count
        if (moves !== 0) {
            scoreBoard.add();
        }
    }
    else {
        console.log("can't move " + dir + " no active robot selected");
    }
}

/**
 * Rewinds all robots to their last checkpoint
 */
function robotRewind() {
    for (r in robots) {
        robots[r].rewind();
    }
    scoreBoard.reset()
}

/**
 * Updates the checkpoints for all robots
 */
function robotUpdateCheckpoint() {
    for (r in robots) {
        robots[r].updateCheckpoint()
    }
}
console.log("Loaded robot.js")
class Robot extends Entity {
    constructor(app, sprite, x, y) {
        // store self to pass onto click events to refer to this object
        let self = super(app, sprite, x, y); 
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
        switch(dir) {
            case "n":
                if (notColliding(robots, north) && inBounds(north)) {
                    this.add(0, -32);
                    console.log("Moving north");
                }
                else {
                    console.log("blocked")
                }
                break;
            case "e":
                if (notColliding(robots, east) && inBounds(east)) {
                    this.add(32, 0);
                    console.log("Moving east");
                }
                else {
                    console.log("blocked")
                }
                break;
            case "w":
                if (notColliding(robots, west) && inBounds(west)) {
                    this.add(-32, 0);
                    console.log("Moving west");
                }
                else {
                    console.log("blocked")
                }
                break;
            case "s":
                if (notColliding(robots, south) && inBounds(south)) {
                    this.add(0,32);
                    console.log("Moving south");
                }
                else {
                    console.log("blocked")
                }
                break;
            default:
                console.log("Invalid direction");
        }
    }
}

/**
 * Assigns the robot that triggers this callback as the active robot
 * @param {event} eventData 
 * @param {Robot} self 
 */
function robotSelect(eventData, self) {
    console.log("Robot clicked!")
    activeRobot = self;
}
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
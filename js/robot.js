console.log("Loaded robot.js")
class Robot extends Entity {
    constructor(app, sprite, x, y) {
        super(app, sprite, x, y);
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

}
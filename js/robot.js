console.log("Loaded robot.js")

class Robot extends Entity {
    checkpoint
    trail
    lastPoint
    lastDir

    constructor(container, sprite, name, displayName, x, y) {
        // store self to pass onto click events to refer to this object
        super(container, sprite, name, displayName, x, y); 
        this.sprite.on('mousedown', (e) => {
            director.activeRobot = this;
            director.renderMarker();
        })
        this.sprite.interactive = true;
        this.checkpoint = {
            x: x,
            y: y
        };
        this.trail = new Graphics();
        this.lastPoint = this.getCenter;
        container.addChild(this.trail);
    }

    /**
     * Moves robot in direction dir by 32 pixels, to conform to the grid
     * @param {string} dir - n e w s
     */
    move(dir, robots, walls) {
        // Get the positions in each cardinal directions
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

        this.lastDir = dir;
        switch(dir) {
            case "n":
                if (notColliding(robots, north) && inBounds(north)) {
                    this.add(0, -32);
                    //this.drawLineSegment();
                    console.log("Moving north");
                    //this.lastPoint = this.getCenter;
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "e":
                if (notColliding(robots, east) && inBounds(east)) {
                    this.add(32, 0);
                    //this.drawLineSegment();
                    console.log("Moving east");
                    //this.lastPoint = this.getCenter;
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "w":
                if (notColliding(robots, west) && inBounds(west)) {
                    this.add(-32, 0);
                    //this.drawLineSegment();
                    console.log("Moving west");
                    //this.lastPoint = this.getCenter;
                    return true;
                }
                else {
                    console.log("blocked")
                    return false;
                }
            case "s":
                if (notColliding(robots, south) && inBounds(south)) {
                    this.add(0,32);
                    //this.drawLineSegment();
                    console.log("Moving south");
                    //this.lastPoint = this.getCenter;
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
        this.trail.clear();
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

    /**
     * Adds a line segment from the last center point to the next center point
     */
    drawLineSegment() {
        let arrowPoint1 = {x: 0, y: 0}
        let arrowPoint2 = {x: 0, y: 0}
        switch(this.lastDir) {
            case "n":
                arrowPoint1 = {
                    x: this.getCenter.x - 10,
                    y: this.getCenter.y + 10
                }
                arrowPoint2 = {
                    x: this.getCenter.x + 10,
                    y: this.getCenter.y + 10
                }
                break;
            case "s":
                arrowPoint1 = {
                    x: this.getCenter.x - 10,
                    y: this.getCenter.y - 10
                }
                arrowPoint2 = {
                    x: this.getCenter.x + 10,
                    y: this.getCenter.y - 10
                }
                break;
            case "e":
                arrowPoint1 = {
                    x: this.getCenter.x - 10,
                    y: this.getCenter.y + 10
                }
                arrowPoint2 = {
                    x: this.getCenter.x - 10,
                    y: this.getCenter.y - 10
                }
                break;
            case "w":
                arrowPoint1 = {
                    x: this.getCenter.x + 10,
                    y: this.getCenter.y - 10
                }
                arrowPoint2 = {
                    x: this.getCenter.x + 10,
                    y: this.getCenter.y + 10
                }
                break;

        }


        let points = [
            this.lastPoint.x, this.lastPoint.y,
            this.getCenter.x, this.getCenter.y,
            arrowPoint1.x, arrowPoint1.y,
            arrowPoint2.x, arrowPoint2.y
            
        ]

        this.trail.lineStyle(4, colorMap[this.name.charAt(0)], 1);

        //this.trail.drawRect(this.activeRobot.getPos.x, this.activeRobot.getPos.y, 32, 32);
        this.trail.drawPolygon(points);
    }

}


let robotMap = {
    "r": "Red",
    "b": "Blue",
    "g": "Green",
    "y": "Yellow",
}

let colorMap = {
    "R": 0xFF0000,
    "G": 0x298F2E,
    "B": 0x000DFF,
    "Y": 0xFFEA00
}

/**
 * Fills the robot container from parsing the text string
 * @param {string} text 
 * @param {Container} cont 
 * @param {TextureCache} id
 * @param {Array} robots
 */
function fillRobots(text, cont, id, robots) {
    let blocks = text.split('\n');
    let bat = "";
    let ht = 0;
    for(block in blocks) {
        for (i = 0; i < 16; i++) {
            let bit = blocks[block][i]
            let x = i * 32 + director.board.x;
            let y = ht * 32 + director.board.y;

            if (bit !== "-") {
                let color = robotMap[bit];

                let fileName = "robot_" + color.toLowerCase() + ".png"
                let shortName = color + " robot"
                let displayName = shortName;
                //robots[bit] = new Target(cont, id[fileName], shortName, displayName, x, y);
                robots[bit] = new Robot(cont, id[fileName], displayName, displayName, x, y);
            }
            bat += bit;
        }
        bat += "\n";
        ht++;
    }
    console.log(bat);
}
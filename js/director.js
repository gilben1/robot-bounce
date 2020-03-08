/**
 * Director object to hold all game state
 */
class Director {
    // public states
    state
    scoreBoard
    // collections
    robots = {}
    targets = {}
    walls = {}

    // active things
    activeText
    activeRobot
    activeTarget

    // containers
    menu
    move
    rewind
    robotCont
    targetCont
    wallCont
    tileCont

    // pixi
    app
    id
    
    // html elements
    rewindButton
    continueButton

    constructor(app, resources) {
        this.app = app;

        this.move = new Container();
        this.robotCont = new Container();
        this.targetCont = new Container();
        this.wallCont = new Container();
        this.tileCont = new Container();
        this.id = resources["img/spritesheet.json"].textures;

        this.activeRobot = this.robots['red'] = new Robot(this.robotCont, this.id["robot_red.png"], "red Robot", "Red Robot", 2 * 32, 14 * 32);
        this.robots['blue'] = new Robot(this.robotCont, this.id["robot_blue.png"], "blue Robot", "Blue Robot", 13 * 32, 1 * 32);
        this.robots['green'] = new Robot(this.robotCont, this.id["robot_green.png"], "green Robot", "Green Robot", 11 * 32, 13 * 32);
        this.robots['yellow'] = new Robot(this.robotCont, this.id["robot_yellow.png"], "yellow Robot", "Yellow Robot", 3 * 32, 1 * 32);

        this.activeText = new Text("None");
        this.activeText.position.set(32, 512);
        
        this.scoreBoard = new Score(256, 512, this.move);

        this.move.addChild(this.activeText);
        this.move.addChild(this.tileCont);
        this.move.addChild(this.targetCont);
        this.move.addChild(this.robotCont);
        this.move.addChild(this.wallCont);

        this.app.stage.addChild(this.move);
        this.state = this.move;

        this.rewindButton = this.setupButton(this.rewindButton, "Rewind", () => {
            this.scoreBoard.reset();
            this.handleRobotRewind();
            this.state = this.move;
        });
        this.continueButton = this.setupButton(this.continueButton, "Continue", () => {
            this.activeTarget = this.newTarget(this.activeTarget, this.targets);
            this.scoreBoard.reset();
            this.state = this.move;
        });
    }



    /*
    ======================
    | GAMELOOP FUNCTIONS |
    ======================
    */

    /**
     * Initializes the gameloop
     */
    initGame() {
        this.app.ticker.add(delta => this.gameloop(delta));
    }

    /**
     * Main gameloop
     * @param {*} delta 
     */
    gameloop(delta) {
        switch(this.state) {
            case this.move:
                this.hideButton(this.continueButton);
                this.hideButton(this.rewindButton);
                this.scoreBoard.updateMoveText();

                if (this.activeTarget === undefined) {
                    this.activeTarget = this.targets[randomInt(0, 17)];
                }

                // If the target has been set and there's an active robot, start processing things
                if (this.activeTarget !== undefined && this.activeRobot !== undefined) {
                    this.activeText.text = this.activeRobot.displayName;
                    this.activeTarget.showMirror()
                    
                    // Getting the correct target
                    if (this.activeRobot.atCorrectTarget(this.activeTarget)) {
                        this.scoreBoard.addScore(this.activeRobot, this.activeTarget);
                        // save the new checkpoints
                        this.updateRobotCheckpoints();
                        this.state = "rewind"
                        //this.activeTarget = this.newTarget(this.activeTarget, this.targets);
                        //this.scoreBoard.reset();
                    }
                }
                break;
            case "rewind":
                this.showButton(this.rewindButton);
                this.showButton(this.continueButton);
                break;
            default:
                console.log("error");
        }
    }

    /**
     * Renders a 16 x 16 grid of tiles
     */
    renderTiles() {
        let tileTexture = this.id["tile.png"];
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let tile = new Sprite(tileTexture);
                tile.x = i * 32;
                tile.y = j * 32;
                this.tileCont.addChild(tile);
            }
        }
    }

    /**
     * Generic function to load entities from a file
     * func is the function process the file with
     * @param {function} func 
     * @param {string} file 
     * @param {Container} cont 
     * @param {array} coll
     */
    loadEntities(func, file, cont, coll) {
        fetch(file)
            .then((response) => response.text())
            .then((text) => func(text, cont, this.id, coll));
    }

    /*
    ===================
    | ROBOT FUNCTIONS |
    ===================
    */

    /**
     * Handle active robot movement in direction dir
     * @param {Char} dir 
     */
    handleRobotMove(dir) {
        if (this.state === this.move) {
            if (this.activeRobot !== undefined) {
                let moves = 0;
                while(this.activeRobot.move(dir, this.robots, this.walls)) { moves++; }
                // If the loop actually moved the robot, add to the move count
                if (moves !== 0) {
                    this.scoreBoard.add();
                }
            }
            else {
                console.log("can't move " + dir + " no active robot selected");
            }
        }
    }

    /**
     * Cycles through the robots based on the current active robot
     */
    cycleRobots() {
        switch(this.activeRobot) {
            case this.robots['red']:
            this.activeRobot = this.robots['blue'];
            break;
            case this.robots['blue']:
            this.activeRobot = this.robots['green'];
            break;
            case this.robots['green']:
            this.activeRobot = this.robots['yellow'];
            break;
            case undefined:
            case this.robots['yellow']:
            this.activeRobot = this.robots['red'];
            break;
        }
    }

    /**
     * Updates all of the checkpoints of the robots
     */
    updateRobotCheckpoints() {
        for (let r in this.robots) {
            this.robots[r].updateCheckpoint()
        }
    }

    /**
     * Handles rewinding all robots back to their checkpoints
     */
    handleRobotRewind() {
        for (let r in this.robots) {
            this.robots[r].rewind();
        }
        this.scoreBoard.reset()
    }

    /*
    ====================
    | TARGET FUNCTIONS |
    ====================
    */

    /**
     * Removes the active target from the pool of targets, and selects a new target
     */
    newTarget() {
        if (this.activeTarget !== undefined) {
            // Remove the active target from the viable list of targets
            this.activeTarget.hideMirror()

            let targetKey = Object.keys(this.targets).find(key => this.targets[key] === this.activeTarget);
            delete this.targets[targetKey];
        }

        this.activeTarget = this.targets[randomInt(0, Object.keys(this.targets).length)]

        this.activeTarget.showMirror()
    }


    /*
    ================
    | UI FUNCTIONS |
    ================
    */

    /**
     * Sets up a button with specified text and onclick function
     * @param {button} buttonName 
     * @param {String} buttonText 
     * @param {function} func - onclick function to execute
     */
    setupButton(buttonName, buttonText, func) {
        buttonName = document.createElement("button");
        buttonName.innerHTML = buttonText;
        this.hideButton(buttonName);
        buttonName.onclick = func;

        document.body.appendChild(buttonName);

        return buttonName;
    }

    hideButton(buttonName) {
        buttonName.style.display = "none";
    }

    showButton(buttonName) {
        buttonName.style.display = "inline-block"
    }


}
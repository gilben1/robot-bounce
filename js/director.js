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
    usedTargets = {}
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

    // settings
    board = {
        x: 0,
        width: 0,
        y: 0,
        height: 0
    }

    // pixi
    app
    id

    // Sprite elements
    activeMarker
    
    // html elements
    rewindButton
    continueButton
    toggleTrailsCB

    constructor(app, resources) {
        this.app = app;

        this.board.x = 0;
        this.board.y = 32;

        this.board.width = app.view.width - 32;
        this.board.height = app.view.height - 64;

        this.move = new Container();
        this.robotCont = new Container();
        this.robotCont.sortableChildren = true;
        this.targetCont = new Container();
        this.wallCont = new Container();
        this.tileCont = new Container();
        this.id = resources["img/spritesheet.json"].textures;

        this.activeMarker = new Graphics();
        this.renderMarker();

        this.activeText = new Text("None");
        this.activeText.position.set(32, this.board.height + 32);
        
        this.scoreBoard = new Score(this.board.width / 2, this.board.height + 32, this.move);

        this.move.addChild(this.activeText);
        this.move.addChild(this.tileCont);
        this.move.addChild(this.targetCont);
        this.move.addChild(this.wallCont);
        this.move.addChild(this.robotCont);
        this.move.addChild(this.activeMarker);

        this.app.stage.addChild(this.move);
        this.state = this.move;

        this.rewindButton = this.setupButton(this.rewindButton, "Rewind", "postButtonDiv", () => { // Rewind functionality
            this.scoreBoard.reset();
            this.handleRobotRewind();
            this.state = this.move;
        });
        this.continueButton = this.setupButton(this.continueButton, "Continue", "postButtonDiv", () => { // continue functionality
            this.newTarget();
            this.updateRobotCheckpoints();
            this.scoreBoard.reset();
            this.state = this.move;
        });
        this.toggleTrailsCB = this.setupCheckBox(this.toggleTrailsCB, "Trails", "preButtonDiv", () => this.toggleRobotTrails());
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

                if (this.activeRobot === undefined) {
                    this.activeRobot = this.robots['r'];
                    this.renderMarker();
                }

                // If the target has been set and there's an active robot, start processing things
                if (this.activeTarget !== undefined && this.activeRobot !== undefined) {
                    this.activeText.text = this.activeRobot.displayName;
                    this.activeTarget.showMirror()
                    
                    // Getting the correct target
                    if (this.activeRobot.atCorrectTarget(this.activeTarget)) {
                        this.scoreBoard.addScore(this.activeRobot, this.activeTarget);
                        this.state = "rewind"
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
                    this.activeRobot.drawLineSegment();
                    this.renderMarker();
                    this.activeRobot.lastPoint = this.activeRobot.getCenter;
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
            case this.robots['r']:
            this.activeRobot = this.robots['b'];
            break;
            case this.robots['b']:
            this.activeRobot = this.robots['g'];
            break;
            case this.robots['g']:
            this.activeRobot = this.robots['y'];
            break;
            case undefined:
            case this.robots['y']:
            this.activeRobot = this.robots['r'];
            break;
        }
        this.renderMarker();
    }

    /**
     * Updates all of the checkpoints of the robots
     */
    updateRobotCheckpoints() {
        for (let r in this.robots) {
            this.robots[r].updateCheckpoint();
            this.robots[r].clearTrail();
        }
    }

    /**
     * Handles rewinding all robots back to their checkpoints
     */
    handleRobotRewind() {
        for (let r in this.robots) {
            this.robots[r].rewind();
            this.robots[r].clearTrail();
        }
        this.scoreBoard.reset();
        this.renderMarker();
    }

    /**
     * Toggles the trails visibility on each robot
     */
    toggleRobotTrails() {
        for (let r in this.robots) {
            this.robots[r].toggleTrail();
        }
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
            this.activeTarget.hideMirror();

            let targetKey = Object.keys(this.targets).find(key => this.targets[key] === this.activeTarget);
            delete this.targets[targetKey];
            // move to the used pool
            this.usedTargets[targetKey] = this.activeTarget;
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
     * Renders a 16 x 16 grid of tiles
     */
    renderTiles() {
        let tileTexture = this.id["tile.png"];
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let tile = new Sprite(tileTexture);
                tile.x = i * 32 + this.board.x;
                tile.y = j * 32 + this.board.y;
                this.tileCont.addChild(tile);
            }
        }
    }

    /**
     * Sets up a button with specified text and onclick function
     * @param {button} buttonName 
     * @param {String} buttonText 
     * @param {String} divName - name of the div to add to
     * @param {function} func - onclick function to execute
     */
    setupButton(buttonName, buttonText, divName, func) {
        buttonName = document.createElement("button");
        buttonName.innerHTML = buttonText;
        this.hideButton(buttonName);
        buttonName.onclick = func;

        let buttonDiv = document.getElementById(divName);
        buttonDiv.appendChild(buttonName);

        return buttonName;
    }

    /**
     * Hide named button
     * @param {String} buttonName 
     */
    hideButton(buttonName) {
        buttonName.style.display = "none";
    }

    /**
     * Show named button
     * @param {String} buttonName 
     */
    showButton(buttonName) {
        buttonName.style.display = "inline-block"
    }

    /**
     * Sets up a checkbox ui element
     * @param {Checkbox} checkBox 
     * @param {String} checkBoxLabel 
     * @param {String} divName 
     * @param {Function} func 
     */
    setupCheckBox(checkBox, checkBoxLabel, divName, func) {
        checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = checkBoxLabel;
        checkBox.checked = true;
        checkBox.onclick = func;

        let label = document.createElement("label");
        label.htmlFor = checkBoxLabel;
        label.appendChild(document.createTextNode(checkBoxLabel));

        let uiDiv = document.getElementById(divName);
        uiDiv.appendChild(checkBox);
        uiDiv.appendChild(label);
    }




    /**
     * Re-draw the marker about the active robot
     */
    renderMarker() {
        if (this.activeRobot === undefined) {
            return;
        }
        this.activeMarker.clear();

        let robX = this.activeRobot.getPos.x;
        let robY = this.activeRobot.getPos.y;
    
        let points = [
            robX + 4, robY - 16,
            robX + 16, robY - 4,
            robX + 28, robY - 16
        ]

        this.activeMarker.lineStyle(4, 0xFF3300, 1);

        this.activeMarker.drawPolygon(points);
    }

}
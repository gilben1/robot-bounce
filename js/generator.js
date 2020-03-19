class Generator {
    seed
    externalWalls
    internalWalls
    robots = [
        'r', 'g', 'b', 'y'
    ]
    tiles = [
        'r0','r1','r2','r3',
        'g0','g1','g2','g3',
        'b0','b1','b2','b3',
        'y0','y1','y2','y3', 'w4'
    ]



    targetMap = {
        "r": "_red",
        "b": "_blue",
        "g": "_green",
        "y": "_yellow",
        "0": "bolt",
        "1": "crescent",
        "2": "cross",
        "3": "diam",
        "w": "wild"
    }

    displayMap = {
        "r": "Red",
        "b": "Blue",
        "g": "Green",
        "y": "Yellow",
        "0": "Bolt",
        "1": "Crescent",
        "2": "Cross",
        "3": "Diamond",
        "4": ""
    }


    dirs = [
        'n', 's', 'e', 'w'
    ]
    ignored = [6,7,8,9]

    cell = {
        coord: {
            x: 0,
            y: 0
        },
        robot: null,
        wall: [],
        target: null
    }
    board = []
    
    // PRNG
    random

    constructor(seed) {
        this.seed = seed;
        this.initEmptyBoard();
        this.random = new PRNG(seed);
    }

    /**
     * Initializes the empty board with coordinates
     */
    initEmptyBoard() {
        for (let i = 0; i < 16; i++) {
            let line = [];
            for (let j = 0; j < 16; j++) {
                line.push({
                    coord: {
                        x: j * 32 + director.board.x,
                        y: i * 32 + director.board.y
                    },
                    robot: null,
                    walls: [],
                    target: null
                });
            }
            this.board.push(line);
        }
    }    

    generateWalls() {
        /*
        =========================================
        Internal walls
        =========================================
        */
        this.generateInternalWalls();

        /*
        =========================================
        External walls
        =========================================
        */
        this.generateExternalWalls();

        /*
        =========================================
        Center cube
        =========================================
        */
       this.board[7][7].walls.push('n', 'w');
       this.completeWall(this.board[7][7], 7, 7);

       this.board[7][8].walls.push('n', 'e');
       this.completeWall(this.board[7][8], 7, 8);

       this.board[8][7].walls.push('s', 'w');
       this.completeWall(this.board[8][7], 8, 7);

       this.board[8][8].walls.push('s', 'e');
       this.completeWall(this.board[8][8], 8, 8);

    }

    /**
     * Generates the internal walls that do not contain targets
     */
    generateInternalWalls() {
        let numInternal = this.random.range_incl(0, 3);
        console.log("num: " + numInternal);

        let internalXmin = this.random.range_incl(2, 7);
        let internalXmax = this.random.range_incl(8, 13);

        let internalYmin = this.random.range_incl(2, 7);
        let internalYmax = this.random.range_incl(8, 13);

        console.log(internalXmin);
        console.log(internalXmax);
        console.log(internalYmin);
        console.log(internalYmax);

        // internal walls
        for (let i = 0; i < numInternal; i++) {
            // Get an x and y coordinate within the bounds
            let x = this.random.range_incl(internalXmin, internalXmax);
            let y = this.random.range_incl(internalYmin, internalYmax);

            // Get a random direction
            let dir = this.random.range_incl(0, 3);
            
            let timeout = 0;
            // don't land in the pairs of the center four squares
            while (this.inMiddleSquare(x,y) && timeout < 200) {
                console.log("trying again");
                x = this.random.range_incl(internalXmin, internalXmax);
                y = this.random.range_incl(internalYmin, internalYmax);
                timeout++;
            }
            // If we keep falling into the same middle block, just get out of there
            if (timeout >= 200) {
                continue;
            }

            console.log("x: " + x + " y: " + y);
            this.board[y][x].walls.push(this.dirs[dir]);
            this.completeWall(this.board[y][x], y, x);
            console.log("Set direction " + this.dirs[dir] + " at coordinate point (" + x + ", " + y + ")");
        }
    }

    /**
     * Generates the external walls on the border of the board
     */
    generateExternalWalls() {
        // top left
        let x = this.random.range_incl(2,6);
        let y = 0;

        this.board[y][x].walls.push(this.dirs[this.random.range_incl(2,3)]);
        this.completeWall(this.board[y][x], y, x);

        x = 0;
        y = this.random.range_incl(2,6);
        
        this.board[y][x].walls.push(this.dirs[this.random.range_incl(0,1)]);
        this.completeWall(this.board[y][x], y, x);

        // top right
        x = this.random.range_incl(9,13);
        y = 0;

        this.board[y][x].walls.push(this.dirs[this.random.range_incl(2,3)]);
        this.completeWall(this.board[y][x], y, x);

        x = 15;
        y = this.random.range_incl(2,6);
        
        this.board[y][x].walls.push(this.dirs[this.random.range_incl(0,1)]);
        this.completeWall(this.board[y][x], y, x);

        // btm left
        x = this.random.range_incl(2,6);
        y = 15;

        this.board[y][x].walls.push(this.dirs[this.random.range_incl(2,3)]);
        this.completeWall(this.board[y][x], y, x);

        x = 0;
        y = this.random.range_incl(9,13);
        
        this.board[y][x].walls.push(this.dirs[this.random.range_incl(0,1)]);
        this.completeWall(this.board[y][x], y, x);

        // btm right
        x = this.random.range_incl(9,13);
        y = 15;

        this.board[y][x].walls.push(this.dirs[this.random.range_incl(2,3)]);
        this.completeWall(this.board[y][x], y, x);

        x = 15;
        y = this.random.range_incl(9,13);
        
        this.board[y][x].walls.push(this.dirs[this.random.range_incl(0,1)]);
        this.completeWall(this.board[y][x], y, x);
    }


    /**
     * Adds a section of wall in the adjacent cell to all walls in the existing cell
     * @param {object} cell 
     * @param {number} x 
     * @param {number} y 
     */
    completeWall(cell, y, x) {
        for (let wall in cell.walls) {
            switch(cell.walls[wall]) {
                case 'n':
                    this.board[y - 1][x].walls.push('s');
                    console.log("Set direction s at coordinate point (" + (y-1) + ", " + x + ")");
                    break;
                case 's':
                    this.board[y + 1][x].walls.push('n');
                    console.log("Set direction n at coordinate point (" + (y+1) + ", " + x + ")");
                    break;
                case 'w':
                    this.board[y][x - 1].walls.push('e');
                    console.log("Set direction e at coordinate point (" + y + ", " + (x-1) + ")");
                    break;
                case 'e':
                    this.board[y][x + 1].walls.push('w');
                    console.log("Set direction w at coordinate point (" + y + ", " + (x+1) + ")");
                    break;
            }
        }
    }

    inMiddleSquare(x,y) {
        //return (x == 7 && y == 7) || (x == 7 && y == 8) || (x == 8 && y == 7) || (x == 8 && y == 8);
        return (x == 6 && (this.ignored.indexOf(y) !== -1))
            || (x == 7 && (this.ignored.indexOf(y) !== -1))
            || (x == 8 && (this.ignored.indexOf(y) !== -1))
            || (x == 9 && (this.ignored.indexOf(y) !== -1))
    }

    generateTargets() {
        // Outer ring, moving inward
        let numRing1 = 2;
        let numRing2 = 7;
        let numRing3 = 4;
        let numRing4 = 2;
        let numRing5 = 1;
        let numRing6 = 1;

        // one inner ring
        this.populateRing(numRing2, 1, 14);
    }

    /**
     * Populates the ring between the low and high bounds with targets
     * @param {*} numTargets 
     * @param {*} lowBound 
     * @param {*} highBound 
     */
    populateRing(numTargets, lowBound, highBound) {
        for (let i = 0; i < numTargets; i++) {
            let tile = this.tiles.splice(this.random.range_incl(0, this.tiles.length - 1), 1)[0];
            console.log(tile);
            let dir1 = this.dirs[this.random.range_incl(0,3)];
            let dir2 = "";
            // based on the first value, randomly determine the second value
            switch(dir1) {
                case 'n':
                case 's':
                    dir2 = this.dirs[this.random.range_incl(2,3)];
                    break;
                case 'e':
                case 'w':
                    dir2 = this.dirs[this.random.range_incl(0,1)];
                    break;
            }

            // generate a random x and y
            let x = this.random.range_incl(lowBound,highBound);
            let y = this.random.range_incl(lowBound,highBound); 
            // if we land x on the edge, generate a random y in the range
            if (x !== lowBound && x !== highBound) { 
                if (y > ((lowBound + highBound) / 2)) {
                    y = highBound;
                }
                else {
                    y = lowBound;
                }
            }

            this.board[y][x].walls.push(dir1, dir2);
            this.completeWall(this.board[y][x], y, x);
            this.board[y][x].target = tile;
        }
    }

    /**
     * Retreives all cells within a specified bounds from the board
     * @param {*} xMin 
     * @param {*} yMin 
     * @param {*} xMax 
     * @param {*} yMax 
     */
    getCells(xMin, yMin, xMax, yMax) {
        let retVal = []
        for (let y = yMin; y <= yMax; y++) {
            for (let x = xMin; y <= xMax; x++) {
                retVal.push(this.board[y][x]);
            }
        }
    }


    populateBoard(targetCont, targets, robotCont, robots, wallCont, walls, id) {
        let wIndex = 0;
        let tIndex = 0;
        for(let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let cell = this.board[j][i];
                let x = cell.coord.x;
                let y = cell.coord.y;
                // fill robots

                // fill targets
                if (cell.target != null) {
                    console.log("boink");
                    console.log(cell.target[0] + " " + cell.target[1]);
                    let fileName = this.targetMap[cell.target[1]] + this.targetMap[cell.target[0]] + ".png";
                    let shortName = this.targetMap[cell.target[1]] + cell.target[0];
                    let displayName = this.displayMap[cell.target[0]] + " " + this.displayMap[cell.target[1]];
                    console.log(fileName + " " + shortName + " " + displayName);

                    targets[tIndex] = new Target(targetCont, id[fileName], shortName, displayName, x, y);
                    tIndex++;
                }

                // fill walls
                for (let wall in cell.walls) {
                    switch(cell.walls[wall]) {
                        case 'n':
                            walls[wIndex] = new Wall(wallCont, id["wall_north.png"], "n", "North", x, y);
                            break;
                        case 's':
                            walls[wIndex] = new Wall(wallCont, id["wall_south.png"], "s", "South", x, y);
                            break;
                        case 'w':
                            walls[wIndex] = new Wall(wallCont, id["wall_west.png"], "w", "West", x, y);
                            break;
                        case 'e':
                            walls[wIndex] = new Wall(wallCont, id["wall_east.png"], "e", "East", x, y);
                            break;
                    }
                    wIndex++;
                }
            }
        }   
    }
}
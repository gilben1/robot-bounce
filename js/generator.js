class Generator {
    seed
    externalWalls
    internalWalls
    robots = [
        'r', 'g', 'b', 'y'
    ]
    tiles = [
        'r0','r0','r0','r0',
        'g0','g0','g0','g0',
        'b0','b0','b0','b0',
        'y0','y0','y0','y0'
    ]
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

    wallsGenerate() {
        /*
        =========================================
        Internal walls
        =========================================
        */

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
            
            // don't land in the pairs of the center four squares
            while (this.inMiddleSquare(x,y)) {
                console.log("trying again");
                x = this.random.range_incl(internalXmin, internalXmax);
                y = this.random.range_incl(internalYmin, internalYmax);
            }
            console.log("x: " + x + " y: " + y);
            this.board[y][x].walls.push(this.dirs[dir]);
            this.completeWall(this.board[y][x], y, x);
            console.log("Set direction " + this.dirs[dir] + " at coordinate point (" + x + ", " + y + ")");
        }

        /*
        =========================================
        External walls
        =========================================
        */
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

    populateBoard(targetCont, targets, robotCont, robots, wallCont, walls, id) {
        let wIndex = 0;
        for(let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let cell = this.board[j][i];
                let x = cell.coord.x;
                let y = cell.coord.y;
                // fill robots

                // fill targets

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
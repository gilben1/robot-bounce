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

    wallsGenerate(seed) {
        //let numInternal = Math.pow(seed, 23) % 3;
        let numInternal = this.random.random_range(0, 3);
        console.log("num: " + numInternal);
        let numExternal = 8;

        //let internalXmin = (Math.pow(seed, 17) % 5) + 2;
        //let internalXmax = (Math.pow(seed, 17) % 5) + 8;
        let internalXmin = this.random.random_range(2, 8);
        let internalXmax = this.random.random_range(8, 14);

        //let internalYmin = (Math.pow(seed, 23) % 5) + 2;
        //let internalYmax = (Math.pow(seed, 23) % 5) + 8;
        let internalYmin = this.random.random_range(2, 8);
        let internalYmax = this.random.random_range(8, 14);

        console.log(internalXmin);
        console.log(internalXmax);
        console.log(internalYmin);
        console.log(internalYmax);

        for (let i = 0; i < numInternal; i++) {
            // Get an x and y coordinate within the bounds
            let x = this.random.random_range(internalXmin, internalXmax + 1);
            let y = this.random.random_range(internalYmin, internalYmax + 1);

            // Get a random direction
            let dir = this.random.random_range(0, 4);
            
            // don't land in the pairs of the center four squares
            while (this.inMiddleSquare(x,y)) {
                console.log("trying again");
                x = this.random.random_range(internalXmin, internalXmax + 1);
                y = this.random.random_range(internalYmin, internalYmax + 1);
            }
            console.log("x: " + x + " y: " + y);
            this.board[x][y].walls.push(this.dirs[dir]);
            this.completeWall(this.board[x][y], x, y);
            console.log("Set direction " + this.dirs[dir] + " at coordinate point (" + x + ", " + y + ")");
        }
    }

    /**
     * Adds a section of wall in the adjacent cell to all walls in the existing cell
     * @param {object} cell 
     * @param {number} x 
     * @param {number} y 
     */
    completeWall(cell, x, y) {
        for (let wall in cell.walls) {
            switch(cell.walls[wall]) {
                case 'n':
                    this.board[x][y - 1].walls.push('s');
                    console.log("Set direction s at coordinate point (" + x + ", " + (y-1) + ")");
                    break;
                case 's':
                    this.board[x][y + 1].walls.push('n');
                    console.log("Set direction n at coordinate point (" + x + ", " + (y+1) + ")");
                    break;
                case 'w':
                    this.board[x - 1][y].walls.push('e');
                    console.log("Set direction e at coordinate point (" + (x-1) + ", " + y + ")");
                    break;
                case 'e':
                    this.board[x + 1][y].walls.push('w');
                    console.log("Set direction w at coordinate point (" + (x+1) + ", " + y + ")");
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

}
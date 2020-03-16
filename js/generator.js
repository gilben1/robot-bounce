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

    constructor(seed) {
        this.seed = seed;
    }

    initEmptyBoard() {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                this.board.push({
                    coord: {
                        x: 0,
                        y: 0
                    },
                    robot: null,
                    wall: [],
                    target: null
                });
            }
        }
    }    
}
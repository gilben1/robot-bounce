class Wall extends Entity {
    constructor(container, sprite, name, x, y) {
        super(container, sprite, name, x, y); 
    }

    collides(dir) {
        return this.name.includes(dir);
    }
}

function loadWalls(move, id) {
    fetch('data/grid.txt')
        .then((response) => response.text())
        .then((text) => fillWalls(text, move, id))
}

function fillWalls(text, move, id) {
    let blocks = text.split('\n');
    let bat = "";
    let index = 0;
    let ht = 0;
    for(block in blocks) {
        for (i = 0; i < 32; i += 2) {
            let bit = blocks[block].substring(i, i + 2);
            bat += bit;
            let x = i * 16;
            let y = ht * 32;
            switch(bit) {
                case "n-":
                    walls[index] = new Wall(move, id["wall_north.png"], "n", x, y);
                    index++;
                    break;
                case "nw":
                    walls[index] = new Wall(move, id["wall_northwest.png"], "nw", x, y);
                    index++;
                    break;
                case "ne":
                    walls[index] = new Wall(move, id["wall_northeast.png"], "ne", x, y);
                    index++;
                    break;
                case "s-":
                    walls[index] = new Wall(move, id["wall_south.png"], "s", x, y);
                    index++;
                    break;
                case "sw":
                    walls[index] = new Wall(move, id["wall_southwest.png"], "sw", x, y);
                    index++;
                    break;
                case "se":
                    walls[index] = new Wall(move, id["wall_southeast.png"], "se", x, y);
                    index++;
                    break;
                case "-w":
                    walls[index] = new Wall(move, id["wall_west.png"], "w", x, y);
                    index++;
                    break;
                case "-e":
                    walls[index] = new Wall(move, id["wall_east.png"], "e", x, y);
                    index++;
                    break;
            }
        }
        bat += "\n";
        ht++;
    }
    console.log(bat);
}
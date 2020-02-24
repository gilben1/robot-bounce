class Wall extends Entity {
    constructor(container, sprite, name, displayName, x, y) {
        super(container, sprite, name, displayName, x, y); 
    }

    collides(dir) {
        return this.name.includes(dir);
    }
}


function fillWalls(text, cont, id) {
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
                if (bit.includes('n')) {
                    walls[index] = new Wall(cont, id["wall_north.png"], "n", "North", x, y);
                    index++;
                }
                if (bit.includes('s')) {
                    walls[index] = new Wall(cont, id["wall_south.png"], "s", "South", x, y);
                    index++;
                }
                if (bit.includes('w')) {
                    walls[index] = new Wall(cont, id["wall_west.png"], "w", "West", x, y);
                    index++;
                }
                if (bit.includes('e')) {
                    walls[index] = new Wall(cont, id["wall_east.png"], "e", "East", x, y);
                    index++;
                }
        }
        bat += "\n";
        ht++;
    }
    console.log(bat);
}
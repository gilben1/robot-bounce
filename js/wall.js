class Wall extends Entity {
    constructor(container, sprite, name, displayName, x, y) {
        super(container, sprite, name, displayName, x, y); 
    }

    /**
     * Returns true if the passed direction matches the name of this wall
     * @param {string} dir - news 
     */
    collides(dir) {
        return this.name.includes(dir);
    }
}

/**
 * Fills the Walls container with walls defined by the contents of text
 * fills directions with n e w s for North, East, West, and South respectively
 * @param {string} text 
 * @param {Container} cont 
 * @param {TextureCache} id 
 */
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
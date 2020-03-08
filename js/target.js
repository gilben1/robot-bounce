console.log("Loaded target.js")

class Target extends Entity{
    mirror
    constructor(container, sprite, name, displayName, x, y) {
        super(container, sprite, name, displayName, x, y);
        this.mirror = new Sprite(sprite); // make a copy we can use to show in the center
        this.mirror.position.set(240 + director.board.x, 240 + director.board.y);
        this.mirror.visible = false;
        container.addChild(this.mirror);
    }

    /**
     * Toggles the central mirror sprite
     */
    toggleMirror() {
        this.mirror.visible = !this.mirror.visible;
    }

    /**
     * Shows the central mirror sprite
     */
    showMirror() {
        this.mirror.visible = true;
    }

    /**
     * Hides the central mirror sprite
     */
    hideMirror() {
        this.mirror.visible = false;
    }
}

let targetMap = {
    "r": "_red",
    "b": "_blue",
    "g": "_green",
    "y": "_yellow",
    "0": "",
    "1": "bolt",
    "2": "crescent",
    "3": "cross",
    "4": "diam",
    "w": "wild"
}

let displayMap = {
    "r": "Red",
    "b": "Blue",
    "g": "Green",
    "y": "Yellow",
    "1": "Bolt",
    "2": "Crescent",
    "3": "Cross",
    "4": "Diamond"
}

/**
 * Fills the target container from parsing the text string
 * @param {string} text 
 * @param {Container} cont 
 * @param {TextureCache} id
 * @param {Array} targets
 */
function fillTargets(text, cont, id, targets) {
    let blocks = text.split('\n');
    let bat = "";
    let index = 0;
    let ht = 0;
    for(block in blocks) {
        for (i = 0; i < 32; i += 2) {
            let bit = blocks[block].substring(i, i + 2);
            let x = i * 16 + director.board.x;
            let y = ht * 32 + director.board.y;

            let fileName = targetMap[bit[1]] + targetMap[bit[0]] + ".png"
            let shortName = targetMap[bit[1]] + bit[0]
            let displayName = displayMap[bit[0]] + " " + displayMap[bit[1]]

            if (bit !== "--") {
                targets[index] = new Target(cont, id[fileName], shortName, displayName, x, y);
                index++;
            }
            bat += bit;
        }
        bat += "\n";
        ht++;
    }
    console.log(bat);
}
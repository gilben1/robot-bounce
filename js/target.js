console.log("Loaded target.js")
class Target extends Entity{
    constructor(container, sprite, name, x, y) {
        super(container, sprite, name, x, y);
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

function fillTargets(text, cont, id) {
    let blocks = text.split('\n');
    let bat = "";
    let index = 0;
    let ht = 0;
    for(block in blocks) {
        for (i = 0; i < 32; i += 2) {
            let bit = blocks[block].substring(i, i + 2);
            let x = i * 16;
            let y = ht * 32;

            let fileName = targetMap[bit[1]] + targetMap[bit[0]] + ".png"
            let shortName = targetMap[bit[1]] + bit[0]

            if (bit !== "--") {
                targets[index] = new Target(cont, id[fileName], shortName, x, y);
                index++;
            }
            bat += bit;
        }
        bat += "\n";
        ht++;
    }
    console.log(bat);
}
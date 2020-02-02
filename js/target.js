console.log("Loaded target.js")
class Target extends Entity{
    mirror
    constructor(container, sprite, name, x, y) {
        super(container, sprite, name, x, y);
        this.mirror = new Sprite(sprite); // make a copy we can use to show in the center
        this.mirror.position.set(240, 240);
        this.mirror.visible = false;
        container.addChild(this.mirror);
    }

    toggleMirror() {
        this.mirror.visible = !this.mirror.visible;
    }

    showMirror() {
        this.mirror.visible = true;
    }

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
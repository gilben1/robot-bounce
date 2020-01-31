console.log("Loaded main.js")

// PIXI Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache,
    Text = PIXI.Text,
    Container = PIXI.Container;

let id;
let robots = {};
let activeRobot;
let activeText;
let targets = {};
let walls = {};
let state;
let menu, move, rewind;

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new Application({
    width: 512, 
    height: 544,
    transparent: true
});

// Add the application view to the html after the window has loaded
window.onload = function(){
    console.log("Appending app.view to document body...")
    document.body.appendChild(app.view);
};


loader
    .add("img/spritesheet.json")
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler(loader, resource){
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}

function setup() {

    move = new Container();
    id = resources["img/spritesheet.json"].textures;
    loadWalls(move, id)
    renderTiles(move, id);

    robots['red'] = new Robot(move, id["robot_red.png"], "Red Robot", 0, 0);
    robots['blue'] = new Robot(move, id["robot_blue.png"], "Blue Robot", 32, 32);
    robots['green'] = new Robot(move, id["robot_green.png"], "Green Robot", 64, 64);
    robots['yellow'] = new Robot(move, id["robot_yellow.png"], "Yellow Robot", 96, 96);
    
    /*walls[0] = new Wall(move, id["wall_east.png"], "e", 32, 0);
    walls[1] = new Wall(move, id["wall_west.png"], "w", 64, 0);
    walls[2] = new Wall(move, id["wall_northeast.png"], "ne", 128, 96);
    walls[3] = new Wall(move, id["wall_south.png"], "s", 128, 64);
    walls[4] = new Wall(move, id["wall_west.png"], "w", 160, 96)*/


    activeText = new Text("None");
    activeText.position.set(32, 512);

    move.addChild(activeText);
    app.stage.addChild(move);

    state = move;

    app.ticker.add(delta => gameloop(delta));
}

function gameloop(delta) {
    if (state === move) {
    }
}

/**
 * Generates a random number between min and max
 * @param {string} min - Lower bound
 * @param {Integer} max - Upper bound
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Renders a 16 x 16 grid of tiles
 * @param {Object} app - PIXI.Application to render onto
 * @param {Object} id - resources cache to load from, usually created by PIXI.loader.resources["path/filename.json"].textures
 */
function renderTiles(container, id) {
    let tileTexture = id["tile.png"];
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 16; j++) {
            let tile = new Sprite(tileTexture);
            tile.x = i * 32;
            tile.y = j * 32;
            container.addChild(tile);
        }
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
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
let activeRobot;
let activeText;
let activeTarget;

let moveCount = 0;
let moveText;

// Collections
let robots = {}, targets = {}, walls = {};
// Containers
let menu, move, rewind, robotCont, targetCont, wallCont, tileCont;

let state;

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
    robotCont = new Container();
    targetCont = new Container();
    wallCont = new Container();
    tileCont = new Container();

    id = resources["img/spritesheet.json"].textures;
    renderTiles(tileCont, id);
    loadEntities(fillTargets, 'data/targets.txt', targetCont, id);
    loadEntities(fillWalls, 'data/grid.txt', wallCont, id);

    robots['red'] = new Robot(robotCont, id["robot_red.png"], "Red Robot", 2 * 32, 14 * 32);
    robots['blue'] = new Robot(robotCont, id["robot_blue.png"], "Blue Robot", 13 * 32, 1 * 32);
    robots['green'] = new Robot(robotCont, id["robot_green.png"], "Green Robot", 11 * 32, 13 * 32);
    robots['yellow'] = new Robot(robotCont, id["robot_yellow.png"], "Yellow Robot", 3 * 32, 1 * 32);
    

    activeText = new Text("None");
    activeText.position.set(32, 512);

    moveText = new Text("Moves: " + moveCount);
    moveText.position.set(256, 512);

    move.addChild(activeText);
    move.addChild(moveText);
    move.addChild(tileCont);
    move.addChild(targetCont);
    move.addChild(robotCont);
    move.addChild(wallCont);

    app.stage.addChild(move);

    state = move;

    app.ticker.add(delta => gameloop(delta));
}

function gameloop(delta) {
    if (state === move) {
        moveText.text = "Moves: " + moveCount;
        activeTarget = targets[0]
        if (activeTarget !== undefined && activeRobot !== undefined) {
            activeTarget.showMirror()
            if (activeRobot.samePosition(activeTarget)) {
                console.log("you win!")
            }
        }
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
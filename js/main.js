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

let director; // director object

let id; // to director
let activeText; // to director

// Collections
let robots = {}, targets = {}, walls = {}; // to director
// Containers
let menu, move, rewind, robotCont, targetCont, wallCont, tileCont; // to director

// Scoreboard for tracking
let scoreBoard; // to director
let state; // to director

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new Application({ // to director
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
    director = new Director(app, resources);
    director.renderTiles();

    // Load up the targets
    director.loadEntities(fillTargets, 'data/targets.txt', director.targetCont, director.targets);

    // Load up the walls
    director.loadEntities(fillWalls, 'data/grid.txt', director.wallCont, director.walls);
}

/**
 * Generates a random number between min and max
 * @param {string} min - Lower bound
 * @param {Integer} max - Upper bound
 */
function randomInt(min, max) {
    console.log(min + " " + max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("Loaded main.js")

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;
let id;
let robots = {};
var activeRobot;
let targets = {};

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new Application({
    width: 512, 
    height: 512,
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
    id = resources["img/spritesheet.json"].textures;
    renderTiles(app, id);

    robots['red'] = new Robot(app, id["robot_red.png"], 0, 0);
    robots['blue'] = new Robot(app, id["robot_blue.png"], 32, 32);
    robots['green'] = new Robot(app, id["robot_green.png"], 64, 64);
    robots['yellow'] = new Robot(app, id["robot_yellow.png"], 96, 96);

    app.ticker.add(delta => gameloop(delta));
}

function gameloop(delta) {
    for (r in robots) {
        let robot = robots[r];
        if (robot.getPos.x > app.view.width) {
            robot.add(robot.getPos.x * -1, 0);
        }
        if (robot.getPos.y > app.view.height) {
            robot.add(0, robot.getPos.y * -1)
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
function renderTiles(app, id) {
    let tileTexture = id["tile.png"];
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 16; j++) {
            let tile = new Sprite(tileTexture);
            tile.x = i * 32;
            tile.y = j * 32;
            app.stage.addChild(tile);
        }
    }
}

// Keyboard function from PixiJS tutorial
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}

function keyMove(dir) {
    console.log("keypress!")
    if (activeRobot !== undefined) {
        activeRobot.move(dir);
    }
    else {
        console.log("can't move " + dir + " no active robot selected");
    }
}

// Setup keyboard interactions
let upKey = keyboard("ArrowUp");
let downKey = keyboard("ArrowDown");
let leftKey = keyboard("ArrowLeft");
let rightKey = keyboard("ArrowRight");

upKey.press = ()  => {
    keyMove('n');
};
downKey.press = ()  => {
    keyMove('s');
};
leftKey.press = ()  => {
    keyMove('w');
};
rightKey.press = ()  => {
    keyMove('e');
};
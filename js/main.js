let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    TextureCache = PIXI.utils.TextureCache;
let id;
let robots = {};

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

window.onload = function(){
    document.body.appendChild(app.view);
};
//Add the canvas that Pixi automatically created for you to the HTML document

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
        robot.add(32, 32)
    }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderTiles(app, id) {
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 16; j++) {
            let tile = new Sprite(id["tile.png"]);
            tile.x = i * 32;
            tile.y = j * 32;
            app.stage.addChild(tile);
        }
    }
}
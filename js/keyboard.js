console.log("Loaded keyboard.js")
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
        while(activeRobot.move(dir)) {}
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
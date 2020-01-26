class Robot {
    sprite;
    constructor(app, sprite, x, y) {
        this.sprite = sprite;
        this.sprite.x = x;
        this.sprite.y = y;
        app.stage.addChild(this.sprite);
    }

    get getPos() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    setPos(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    add(x, y) {
        this.sprite.x += x;
        this.sprite.y += y;
    }
}
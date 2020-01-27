class Wall extends Entity {
    constructor(app, sprite, name, x, y) {
        super(app, sprite, name, x, y); 
    }

    collides(dir) {
        return this.name.includes(dir);
    }
}
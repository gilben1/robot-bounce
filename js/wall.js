class Wall extends Entity {
    constructor(container, sprite, name, x, y) {
        super(container, sprite, name, x, y); 
    }

    collides(dir) {
        return this.name.includes(dir);
    }
}
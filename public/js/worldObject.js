class WorldObject {

    constructor(pos, size, max) {
        this.pos = pos;
        this.size = size;
        this.max;
    }

    getLeftBound() {
        return this.pos.x - this.size.x/2;
    }

    getRightBound() {
        return this.pos.x + this.size.x/2;
    }

    getUpperBound() {
        return this.pos.y - this.size.y/2;
    }

    getLowerBound() {
        return this.pos.y + this.size.y/2;
    }

}

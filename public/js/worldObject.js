class WorldObject {

    constructor(x, y, w, h, maxX, maxY) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    getLeftBound() {
        return this.x - this.w/2;
    }

    getRightBound() {
        return this.x + this.w/2;
    }

    getUpperBound() {
        return this.y - this.h/2;
    }

    getLowerBound() {
        return this.y + this.h/2;
    }

}

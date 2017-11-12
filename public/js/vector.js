class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
}

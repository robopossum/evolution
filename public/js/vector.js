class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.round();
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    static negate(vector) {
        return new Vector(vector.x * -1, vector.y * -1);
    }

    multiply(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    length() {
        Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    round() {
        this.x *= 1000;
        this.x = Math.trunc(this.x);
        this.x /= 1000;
        this.y *= 1000;
        this.y = Math.trunc(this.y);
        this.y /= 1000;
    }
}

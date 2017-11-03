class Sensor {

    constructor(r, offset, w) {
        this.r = r;
        this.offset = offset;
        this.w = w;
        this.rgbC = {
            r: 210,
            g: 30,
            b: 30
        };
        this.rgbA = {
            r: 60,
            g: 140,
            b: 75
        };
    }

    isColliding(world, x, y, angle) {
        var collision = [0,0,0];
        var xs = this.getX(x, angle);
        var ys = this.getY(y, angle);
        world.objects.forEach(function (object) {
            if (object instanceof Wall && object.contains(x, y, xs, ys)) {
                var intersect = object.getIntersect(x, y, xs, ys, angle + this.offset);
                intersect[2] = 1 - intersect[2] / this.r;
                collision = (intersect[2] > collision[2]) ? intersect : collision;
            }
        }.bind(this));
        this.collisionX = collision[0] || this.getX(x, angle);
        this.collisionY = collision[1] || this.getY(y, angle);
        this.collision = collision[2] || 0.0;
    }

    getX(x, a) {
        return x + Math.cos(a + this.offset) * this.r;
    }

    getY(y, a) {
        return y + Math.sin(a + this.offset) * this.r;
    }

    render(context, x, y) {
        context.beginPath();
        context.fillStyle = this.getColour();
        context.arc(x, y, this.w/2, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    getColour() {
        var colour = 'rgb('
            + Math.round(((this.rgbC.r - this.rgbA.r) * this.collision) + this.rgbA.r) + ','
            + Math.round(((this.rgbC.g - this.rgbA.g) * this.collision) + this.rgbA.g) + ','
            + Math.round(((this.rgbC.b - this.rgbA.b) * this.collision) + this.rgbA.b)
            + ')';
        return colour;
    }
}

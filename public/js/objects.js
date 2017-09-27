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

class PhysicsObject extends WorldObject {
    //Bot
    //Movement
}

class StaticObject extends WorldObject {
    //Wall
    //Collisions

    contains(x, y, x1, y1) {
        return this.containsX(x, x1)
            && this.containsY(y, y1);
    }

    containsX(x, x1) {
        var min = Math.min.apply(Math, [x, x1]);
        var max = Math.max.apply(Math, [x, x1]);
        return (min < this.getLeftBound() && this.getLeftBound() < max)
            || (min < this.getRightBound() && this.getRightBound() < max)
            || (this.getLeftBound() < min && this.getRightBound() > max);
    }

    containsY(y, y1) {
        var min = Math.min.apply(Math, [y, y1]);
        var max = Math.max.apply(Math, [y, y1]);
        return (min < this.getUpperBound() && this.getUpperBound() < max)
            || (min < this.getLowerBound() && this.getLowerBound() < max)
            || (this.getUpperBound() < min && this.getLowerBound() > max);
    }

    getIntersect(x, y, x1, y1, angle) {
        var intersectX = this.getXIntersect(x, y, angle);
        var intersectY = this.getYIntersect(x, y, angle);
        if (intersectX[2] < intersectY[2]) {
            return intersectX;
        }
        return intersectY;
    }

    getYIntersect(x, y, angle) {
        var ix, iy, id, y1;
        if (y < this.getUpperBound()) {
            y1 = this.getUpperBound();
        } else {
            y1 = this.getLowerBound();
        }
        id = (y1 - y) / Math.sin(angle);
        ix = x + ((y1 - y) / Math.tan(angle));
        iy = y1;
        if (ix < this.getLeftBound() || ix > this.getRightBound()) {
            return [0, 0, 100];
        }
        return [ix, iy, id];
    }

    getXIntersect(x, y, angle) {
        var ix, iy, id, x1;
        if (x < this.getLeftBound()) {
            x1 = this.getLeftBound();
        } else {
            x1 = this.getRightBound();
        }
        id = (x1 - x) / Math.cos(angle);
        ix = x1;
        iy = y + ((x1 - x) * Math.tan(angle));
        if (iy > this.getLowerBound() || iy < this.getUpperBound()) {
            return [0, 0, 100];
        }
        return [ix, iy, id];
    }
}

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
                console.log(intersect);
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
        console.log(this.collision);
        var colour = 'rgb('
            + Math.round(((this.rgbC.r - this.rgbA.r) * this.collision) + this.rgbA.r) + ','
            + Math.round(((this.rgbC.g - this.rgbA.g) * this.collision) + this.rgbA.g) + ','
            + Math.round(((this.rgbC.b - this.rgbA.b) * this.collision) + this.rgbA.b)
            + ')';
        console.log(colour);
        return colour;
    }
}

class Camera extends WorldObject {

    setZoom(zoom) {
        this.zoom = zoom;
    }

    getZoom() {
        return this.zoom;
    }

    setPanSpeed(speed) {
        this.panSpeed = speed;
    }

    getPanSpeed() {
        return this.panSpeed;
    }

    move(up, left, down, right) {
        this.x += (right - left) * this.panSpeed;
        this.y += (down - up) * this.panSpeed;
    }

    shouldRender(object) {
        return object.getRightBound() > this.getLeftBound()
            && object.getLeftBound() < this.getRightBound()
            && object.getUpperBound() < this.getLowerBound()
            && object.getLowerBound() > this.getUpperBound()
        ;
    }

    renderObject(context, object) {
        if (!this.shouldRender(object)) {
            return;
        }
        object.render(
            context,
            object.getLeftBound() - this.getLeftBound(),
            object.getUpperBound() - this.getUpperBound(),
            object.getRightBound() - object.getLeftBound(),
            object.getLowerBound() - object.getUpperBound()
        );

    }

    clear(context) {
        context.fillStyle = 'black';
        context.fillRect(0,0,this.w, this.h);
    }
}

class Bot extends WorldObject {

    init(r) {
        this.angle = 0;
        this.sensors = [];
        this.addSensor(r, 0);
        this.addSensor(r, -1);
        this.addSensor(r, 1);
    }

    sense(world) {
        this.sensors.forEach(function (sensor) {
            sensor.isColliding(world, this.x, this.y, this.angle);
        }.bind(this));
    }

    setLookAngle(angle) {
        this.angle = angle;
    }

    getLookAngle() {
        return this.angle;
    }

    addSensor(r, offset) {
        this.sensors.push(new Sensor(
            r,
            offset,
            10,
        ));
    }

    render(context, x1, y1, x2, y2) {
        //Debug square
        //context.fillStyle = 'green';
        //context.fillRect(x1, y1, x2, y2);
        x1 += this.w/2;
        y1 += this.w/2;
        var angle = this.angle;
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(x1, y1, this.w/2, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        this.sensors.forEach(function (sensor) {
            context.beginPath();
            context.strokeStyle = 'rgb(60, 140, 75)';
            context.moveTo(x1, y1);
            context.lineTo(
                x1 + (sensor.collisionX - this.x),
                y1 + (sensor.collisionY - this.y)
            );
            context.stroke();
            context.closePath();
            sensor.render(context, x1 + (sensor.collisionX - this.x), y1 + (sensor.collisionY - this.y));
        }.bind(this));
    }

}

class Wall extends StaticObject {

    render(context, x1, y1, x2, y2) {
        context.fillStyle = 'rgb(50, 90, 165)';
        context.fillRect(x1, y1, x2, y2);
    }

}

class World {

    constructor(context, w, h) {
        this.context = context;
        this.width = w;
        this.height = h;
        this.objects = [];
    }

    initCamera(w, h) {
        this.camera = new Camera(
            this.width/2,
            this.height/2,
            w,
            h,
            this.width,
            this.height
        );
    }

    addObject(object) {
        if(object instanceof Bot) {
            this.bot = object;
        }
        this.objects.push(object);
    }

    render() {
        this.camera.clear(this.context);
        this.context.fillStyle = 'rgb(190, 205, 240)';
        this.context.fillRect(
            this.getLeftBound(),
            this.getUpperBound(),
            this.getRightBound(),
            this.getLowerBound()
        );
        this.objects.forEach(function (object) {
            this.camera.renderObject(this.context, object);
        }.bind(this));
    }

    getLeftBound() {
        return (-this.camera.getLeftBound() < 0) ? 0 : -this.camera.getLeftBound();
    }

    getRightBound() {
        return (this.camera.getRightBound() < this.width) ? this.camera.w : this.camera.w - (this.camera.getRightBound() - this.width);
    }

    getUpperBound() {
        return (-this.camera.getUpperBound() < 0) ? 0 : -this.camera.getUpperBound();
    }

    getLowerBound() {
        return (this.camera.getLowerBound() < this.height) ? this.camera.h : this.camera.h - (this.camera.getLowerBound() - this.height);
    }
}

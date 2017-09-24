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

class Sensor {

    constructor(r, offset, w) {
        this.r = r;
        this.offset = offset;
        this.w = w;
    }

    getX(x, a) {
        return x + Math.cos(a + this.offset) * this.r;
    }

    getY(y, a) {
        return y + Math.sin(a + this.offset) * this.r;
    }

    render(context, x, y) {
        context.fillStyle = 'green';
        context.fillRect(x - this.w/2, y - this.w/2, this.w, this.w);
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
            context.fillStyle = 'green';
            context.strokeStyle = 'green';
            context.moveTo(x1, y1);
            context.lineTo(
                sensor.getX(x1, angle),
                sensor.getY(y1, angle)
            );
            context.stroke();
            context.closePath();
            sensor.render(context, sensor.getX(x1, angle), sensor.getY(y1, angle));
        });
    }

}

class Wall extends WorldObject {

    render(context, x1, y1, x2, y2) {
        context.fillStyle = 'red';
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
        this.context.fillStyle = 'blue';
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

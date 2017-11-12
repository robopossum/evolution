class Bot extends RigidBody {

    init(r) {
        this.w = 40;
        this.h = 40;
        this.maxV = 10;
        this.maxRV = Math.PI / 30;
        this.sensors = [];
        //this.addSensor(r, 0);
        //this.addSensor(r, -1);
        //this.addSensor(r, 1);
    }

    sense(world) {
        this.sensors.forEach(function (sensor) {
            sensor.isColliding(world, this.x, this.y, this.angle);
        }.bind(this));
    }

    addSensor(r, offset) {
        this.sensors.push(new Sensor(
            r,
            offset,
            10,
        ));
    }

    calculateInertia() {
        this.inertia = (this.mass * (this.w/2) * (this.w/2)) / 2;
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
        context.beginPath();
        context.strokeStyle = 'rgb(255,0,0)';
        context.moveTo(x1, y1);
        context.lineTo(x1 + (this.w/2) * Math.cos(this.angle), y1 + (this.w/2) * Math.sin(this.angle));
        context.stroke();
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

    getLeftBound() {
        return this.pos.x - this.w/2;
    }

    getRightBound() {
        return this.pos.x + this.w/2;
    }

    getUpperBound() {
        return this.pos.y - this.h/2;
    }

    getLowerBound() {
        return this.pos.y + this.h/2;
    }

}

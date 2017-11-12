class Bot extends RigidBody {

    constructor(pos, angle, mass, r) {
        super(pos, angle, mass);
        this.w = 40;
        this.h = 40;
        this.mu = 1;
        this.muR = 100;
        this.maxV = 10;
        this.maxRV = Math.PI / 30;
        this.sensors = [];
        //this.addSensor(r, 0);
        //this.addSensor(r, -1);
        //this.addSensor(r, 1);
    }

    update() {
        //this.applyForce(this.calculateDrag());
        this.applyForce(this.calculateFriction());
        this.applyRot(this.calculateRotationalFriction());
        super.update();
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

    calculateDrag() {
        return Vector.negate(
            new Vector(
                (this.vel.x < 0 ? -1 : 1) * (Math.pow(this.vel.x, 2) * this.mu) / 2,
                (this.vel.y < 0 ? -1 : 1) * (Math.pow(this.vel.y, 2) * this.mu) / 2,
            )
        );
    }

    calculateFriction() {
        return Vector.negate(this.vel).multiply(this.mu);
    }

    calculateRotationalFriction() {
        return this.aVel * this.muR * -1;
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

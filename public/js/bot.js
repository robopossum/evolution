class Bot extends WorldObject {

    init(r) {
        this.angle = 0;
        this.a = 0;
        this.v = 0;
        this.maxV = 10;
        this.rA = 0;
        this.rV = 0;
        this.maxRV = Math.PI / 30;
        this.sensors = [];
        this.addSensor(r, 0);
        this.addSensor(r, -1);
        this.addSensor(r, 1);
    }

    update(world) {
        this.rV += this.rA;
        if (Math.abs(this.rV) > this.maxRV) {
            this.rV = this.maxRV * (Math.abs(this.rV) / this.rV);
        }
        this.v += this.a;
        if (Math.abs(this.v) > this.maxV) {
            this.v = this.maxV * (Math.abs(this.v) / this.v);
        }
        this.angle += this.rV;
        this.x += this.v * Math.cos(this.angle);
        this.y += this.v * Math.sin(this.angle);
        this.collide(world);
        this.sense(world);
    }

    sense(world) {
        this.sensors.forEach(function (sensor) {
            sensor.isColliding(world, this.x, this.y, this.angle);
        }.bind(this));
    }

    collide(world) {
        var x = this.x - this.w/2;
        var y = this.x - this.h/2;
        var x1 = x + this.w;
        var y1 = x + this.h;
        world.objects.forEach(function (object) {
            if (object instanceof Wall) {
                var collision = object.collides(x, y, x1, y1);
                if (collision.x) {
                    this.x += collision.x;
                }
                if (collision.y) {
                    this.y += collision.y;
                }
            }
        }.bind(this));
    }

    setLookAngle(angle) {
        this.angle = angle;
    }

    getLookAngle() {
        return this.angle;
    }

    setMaxSpeed(v) {
        this.maxV = v;
    }

    getMaxSpeed() {
        return this.maxV;
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

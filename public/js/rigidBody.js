class RigidBody {

    constructor(position, angle, mass) {
        this.force = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.pos = position;
        this.aAcc = 0.0;
        this.aVel = 0.0;
        this.angle = angle;
        this.mass = mass;
    }

    applyForce(force) {
        this.force.add(force);
    }

    applyRot(rot) {

        if (typeof this.inertia == 'undefined') {
            this.calculateInertia();
        }

        this.aAcc += rot / this.inertia;
    }

    calculateInertia() {
        //override in subclasses
    }

    update() {
        this.acc.x = this.force.x / this.mass;
        this.acc.y = this.force.y / this.mass;
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.aVel += this.aAcc;
        this.aVel *= 1000;
        this.aVel = Math.trunc(this.aVel);
        this.aVel /= 1000;
        this.angle += this.aVel;

        this.force.reset();
        this.aAcc = 0.0;
    }
}

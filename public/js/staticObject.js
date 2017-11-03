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

    collides(x, y, x1, y1) {
        var collideX = 0.0;
        var collideY = 0.0;
        if (this.containsY(y, y1)) {
            if (x < this.getRightBound()) {
                collideX = this.getRightBound() - x;
            } else if (x1 > this.getLeftBound()) {
                collideX = this.getLeftBound() - x1;
            }
        }
        if (this.containsX(x, x1)) {
            if (y > this.getUpperBound()) {
                collideY = this.getUpperBound() - y;
            } else if (y1 < this.getLowerBound()) {
                collideY = this.getLowerBound() - y1;
            }
        }
        return {
            x: collideX,
            y: collideY
        };
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

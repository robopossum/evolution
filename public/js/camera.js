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
        this.pos.x += (right - left) * this.panSpeed;
        this.pos.y += (down - up) * this.panSpeed;
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

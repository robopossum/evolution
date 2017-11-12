class World {

    constructor(context, w, h) {
        this.context = context;
        this.width = w;
        this.height = h;
        this.objects = [];
    }

    initCamera(w, h) {
        this.camera = new Camera(
            new Vector(this.width/2, this.height/2),
            new Vector(w, h),
            new Vector(this.width, this.height)
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
        return (this.camera.getRightBound() < this.width) ? this.camera.size.x : this.camera.size.x - (this.camera.getRightBound() - this.width);
    }

    getUpperBound() {
        return (-this.camera.getUpperBound() < 0) ? 0 : -this.camera.getUpperBound();
    }

    getLowerBound() {
        return (this.camera.getLowerBound() < this.height) ? this.camera.size.y : this.camera.size.y - (this.camera.getLowerBound() - this.height);
    }
}

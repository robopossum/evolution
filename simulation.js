var App = {

    canvas: null,

    fps: 30,

    objects: {},

    initialize: function() {
        this.canvas = document.getElementById('game-canvas');
        setInterval(this.update, 1000/this.fps);
    },

    update: function() {

    },
};

window.onload = function() {
    App.initialize();
}

var objects = [
    'vector',
    'rigidBody',
    'worldObject',
    'staticObject',
    'sensor',
    'camera',
    'bot',
    'wall',
    'world'
];

objects.forEach(function(obj) {
    var script = document.createElement('script');
    script.src = 'js/' + obj + '.js';
    document.getElementsByTagName('head')[0].appendChild(script);
});

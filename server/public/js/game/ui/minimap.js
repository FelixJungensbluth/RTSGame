var map
var mapScaleX = 0;
var mapScaleY = 0;

var testMap = new Array();

function createMap(scene) {
    map = scene.add.image(0 + 200, window.innerHeight - 200, 'minimap').setScrollFactor(0);

    var mapWidth = isometricTo2d(IsometricMap.map.length, IsometricMap.map[0].length).x - isometricTo2d(0, 0).x;
    var mapHeight = isometricTo2d(0, 0).y + isometricTo2d(0, IsometricMap.map[0].length).y;

    mapScaleX = 600 / mapWidth;
    mapScaleY = 600 / mapWidth;
}

function addBuilindsToMap(x, y) {
    var angle = 90;
    var rad = angle * Math.PI / 180;
    var newX = x * Math.cos(-rad) - y * Math.sin(-rad);
    var newY = y * Math.cos(-rad) + x * Math.sin(-rad);

    scene.add.rectangle(((newX) * mapScaleX) - 250, (-((newY * mapScaleY))) + 600, 10, 10, 0xFFFFFF, 1).setScrollFactor(0);
}


function isometricTo2d(Xi, Yi) {
    var offX = Xi * tileColumnOffset / 2 + Yi * tileColumnOffset / 2 + originX;
    var offY = Yi * tileRowOffset / 2 - Xi * tileRowOffset / 2 + originY;

    var cords = {
        x: offX,
        y: offY,
    }

    return cords;
}
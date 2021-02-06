var map
var mapScaleX = 0;
var mapScaleY = 0;
var color = 0;
var tileWidth;
var tileHeight;

var testMap = new Array();


/*
 Map wird erstellt
 Skalierungsfaktor wird berechnet
*/
function createMap(scene) {
    // Map Image
    map = scene.add.image(0 + 180, window.innerHeight - 173, 'minimap').setScrollFactor(0);
    map.setDepth(3999);
    var width = 344;
    var height = 327;
    var columns = IsometricMap.map[0].length;
    var rows = IsometricMap.map.length;
    tileWidth = width / columns;
    tileHeight = height / rows;
}

/*
 Positon auf der Karte wird berechnet 
*/
function addBuilindsToMap(x, y) {
    var xPos = x * tileWidth;
    var yPos = y * tileHeight;


    var mapDisplay = {
        x: xPos,
        y: yPos,
        team: teamname,
    }

    scene.socket.emit('onMap', mapDisplay);
}

/*
Gebäude werden auf der Map angezeigt 
*/
function addBuildingOnMap(scene) {
    scene.socket.on('allBuildingsOnMap', function (rec) {

        if (teamname == 1 && (rec[rec.length - 1].team != 1)) {
            color = 0xFFFFFF;
        } else {
            color = 0x000080;
        }

        var mapPos = scene.add.rectangle(rec[rec.length - 1].x, rec[rec.length - 1].y + window.innerHeight - 327, 10, 10, color, 1).setScrollFactor(0);
        mapPos.setDepth(4000);
    });
}

/*
 Umrechnung von Weltkoordinaten in 2D Koordinaten
*/
function isometricTo2d(Xi, Yi) {
    var offX = Xi * tileColumnOffset / 2 + Yi * tileColumnOffset / 2 + originX;
    var offY = Yi * tileRowOffset / 2 - Xi * tileRowOffset / 2 + originY;

    var cords = {
        x: offX,
        y: offY,
    }

    return cords;
}
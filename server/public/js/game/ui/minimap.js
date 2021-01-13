var map
var mapScaleX = 0;
var mapScaleY = 0;
var color = 0;

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

    var xCor = ((newX) * mapScaleX) - 250;
    var yCor = (-((newY * mapScaleY))) + 600;

    var mapDisplay = {
        x: xCor,
        y: yCor,
        team: teamname,
    }

    scene.socket.emit('onMap', mapDisplay);
    // scene.add.rectangle(xCor, yCor, 10, 10, color, 1).setScrollFactor(0);
}

function addBuildingOnMap(scene) {
    scene.socket.on('allBuildingsOnMap', function (rec) {

        if (teamname == 1 && (rec[rec.length - 1].team != 1)) {
            color = 0xFFFFFF;
        } else {
            color = 0x000080;
        }
        scene.add.rectangle(rec[rec.length - 1].x, rec[rec.length - 1].y, 10, 10, color, 1).setScrollFactor(0);
        console.log(rec)
        console.log(removeDuplicate(rec));
    });
}

function removeDuplicate(array) {
    var dataArr = array.map(item => {
        return [JSON.stringify(item), item]
    }); // creates array of array
    var maparr = new Map(dataArr); // create key value pair from array of array

    var result = [...maparr.values()]; //converting back to array from mapobject

    return result;
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
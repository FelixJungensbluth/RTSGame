var mapOverlay;
var timeOverlay;
var resourceOverlay;
var onlyOnce = true;

var hpText;

var hpBackground;

/*
 Alle Overlays werden in die SCene platziert 
 Map, Zeit, Materialien
*/
function displayOverlay() {
    mapOverlay = scene.add.image(200, window.innerHeight - 200, 'olMap').setScrollFactor(0);
    timeOverlay = scene.add.image(109, 17, 'olTime').setScrollFactor(0);
    resourceOverlay = scene.add.image(90, 48, 'olResource').setScrollFactor(0);
}


function hp() {
    if ((selectedTileX >= 0 && selectedTileX < IsometricMap.buildingMap.length) && (selectedTileY >= 0 && selectedTileY < IsometricMap.buildingMap[0].length)) {
    if (IsometricMap.buildingMap[selectedTileX][selectedTileY] != 5 && IsometricMap.buildingMap[selectedTileX][selectedTileY] != 0) {
        if (onlyOnce && IsometricMap.buildingMap[selectedTileX][selectedTileY].canBeSelected) {
            hpBackground = scene.add.rectangle(
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                80, 5, 0xff0000
            );

            testRect = scene.add.rectangle(
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                80, 5, 0x39ff14
            );

            /*
            hpText = scene.add.text(
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX - 50,
                IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 70,
                'HP:', {
                    font: "15px Arial",
                    fill: '#000000',
                }).setScrollFactor(0);
            hpText.setText('HP: ' + IsometricMap.buildingMap[selectedTileX][selectedTileY].hp);
            */
            onlyOnce = false;
        }
    } else {
        if (testRect) {
            testRect.destroy();
            hpBackground.destroy();
        }
        onlyOnce = true;
    }
}
}

function updateHp(){
    if (testRect) {
    var currentHp = IsometricMap.buildingMap[selectedTileX][selectedTileY].currentHp;
    var base = IsometricMap.buildingMap[selectedTileX][selectedTileY].baseHp;

    var lostHp = (currentHp * 100) / base;
    testRect.width = (80 * lostHp)/100;
    }
}
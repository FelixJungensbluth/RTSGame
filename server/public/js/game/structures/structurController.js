var damagePositon = new Array();
var globalDamage = new Array();
var play = true;
var canBuild = false;

/*
Positon auf der Map welches Gebäude Schaden bekommt
*/
function destroyBuilding(x, y, scene) {
    var positon = {
        xPos: x,
        yPos: y,
    }

    damagePositon.push(positon);

    for (var i = 0; i < buildingArray.length; i++) {
        if (buildingArray[i].image == 'none') {
            buildingArray.splice(i, 1);
        }
    }

    scene.socket.emit('damagePositon', positon);
}

/*
Schaden wird auf die Gebäude ausgeübt
Wenn das Leben auf 0 fällt wird das Gebäude entfernt 
*/
function doDamage(scene) {
    if (globalDamage.length != 0) {
        globalDamage.forEach(building => {

            if (!removeDamage) {
                play = true;
                IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp -= 10 + damageUp;
            } else {
                play = false;
                IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp -= 0;
            }

            if (IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp <= 0) {
                for (var i = 0; i < imageArray.length; i++) {

                    if (imageArray[i].x == IsometricMap.buildingMapAll[building.xPos][building.yPos].positionX && imageArray[i].y == IsometricMap.buildingMapAll[building.xPos][building.yPos].positionY) {
                        playExplosion(scene, imageArray[i].x, imageArray[i].y);
                        imageArray[i].destroy();
                        imageArray.splice(i, 1);
                        globalDamage.splice(globalDamage.length - 1, 1);

                        if (IsometricMap.buildingMapAll[building.xPos][building.yPos].name == "hq") {
                            win = true;
                            scene.socket.emit('win', win);

                        }
                        play = false;
                    }
                }
                IsometricMap.buildingMapAll[building.xPos][building.yPos] = 0;
            }
        });
    }
}

function globalDamagePos() {
    scene.socket.on('testDmg', function (pos) {
        pos.forEach(sdfs => {
            globalDamage.push(sdfs);
        });
    });
}
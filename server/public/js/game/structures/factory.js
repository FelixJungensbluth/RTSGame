var factoryImg = "none";

function drawFac(Xi, Yi) {
    var offX = (Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX) + 20;
    var offY = (Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY) - 100;
    var fac = {
        "id": "4",
        "name": "Fabrik",
        "baseHp": 500,
        "currentHp": 100,
        "positionX": offX,
        "positionY": offY,
        "tileX": Xi,
        "tileY": Yi,
        "AnzhalTilesX": "4",
        "AnzhalTilesY": "2",
        "fabricIsSelected": false,
        "canBeSelected": false,
        "image": factoryImg,
    }
    
    this.buildingArray.push(fac);
    
    IsometricMap.buildingMap[Xi][Yi] = fac;
    IsometricMap.buildingMap[Xi - 1][Yi] = fac;
    IsometricMap.buildingMap[Xi - 2][Yi] = fac;
    IsometricMap.buildingMap[Xi][Yi + 1] = fac;
    IsometricMap.buildingMap[Xi - 1][Yi + 1] = fac;
    IsometricMap.buildingMap[Xi - 2][Yi + 1] = fac;

    IsometricMap.grid[Yi][Xi] = fac;
    IsometricMap.grid[Yi + 1][Xi] = fac;
    IsometricMap.grid[Yi + 2][Xi] = fac;
    IsometricMap.grid[Yi][Xi - 1] = fac;
    IsometricMap.grid[Yi + 1][Xi - 1] = fac;
    IsometricMap.grid[Yi + 2][Xi - 1] = fac;
}

/*
Anzeige der Gebaeude fuer den CLient
Daten von starLocation2 werden Empfangen und verarbeitet
*/
function addFactory(scene) {
    scene.socket.on('factory', function (hqLocation) {
        if (teamname === 1) {
            factoryImg = scene.add.image(hqLocation.x, hqLocation.y, 'factory').setInteractive();
            factoryImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
            imageArray.push(factoryImg);
            drawFac(selectedTileX, selectedTileY, scene);
            resourceCounter -= 25;
        } else if (teamname != 1) {
            factoryImg = scene.add.image(hqLocation.x, hqLocation.y, 'factory').setInteractive();
            factoryImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
            imageArray.push(factoryImg);
            drawFac(selectedTileX, selectedTileY, scene);
            resourceCounter -= 25;
        }
    });
}
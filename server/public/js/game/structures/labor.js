var laborImg = "none";
var laborCounter = 0;
/*
  Darstellung des Labors

  Die Position im 2D Array der Map wird in X & Y Koordinaten umgerechnet 
  Das Bild des HQ besitzt eine ID welche auch im Array gespeichret ist 

  Alle Infomationen ueber das HQ werden in einem Objekt gespeichert
  ID im Array wird durch das Objekt ersezt, damit man immer auf die Infos zugreifen kann

  Xi = X-Koordninate im Array der Map
  Yi = Y-Koordninate im Array der Map
*/
function drawLabor(Xi, Yi, scene) {
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    var labor = {
        "id": "3",
        "name": "Labor",
        "baseHp": 1000,
        "currentHp": 1000,
        "positionX": offX,
        "positionY": offY,
        "tileX": Xi,
        "tileY": Yi,
        "AnzhalTilesX": "1",
        "AnzhalTilesY": "1",
        "isSelected": false,
        "laborIsSelected": false,
        "canBeSelected": false,
        "image": laborImg,
    }

    // Map Arrays werden geupdated
    this.buildingArray.push(labor);
    IsometricMap.buildingMap[Xi][Yi] = labor;
    IsometricMap.buildingMap[Xi - 1][Yi] = labor;
    IsometricMap.buildingMap[Xi][Yi + 1] = labor;
    IsometricMap.buildingMap[Xi - 1][Yi + 1] = labor;

    IsometricMap.grid[Yi][Xi] = labor;
    IsometricMap.grid[Yi + 1][Xi] = labor;
    IsometricMap.grid[Yi][Xi - 1] = labor;
    IsometricMap.grid[Yi + 1][Xi - 1] = labor;
    // Wird auf der Map angezeigt 
    addBuilindsToMap(offY, offX);

    // Pathfinding Grid wird geupdated
    easystar.setAcceptableTiles([0]);
    easystar.setGrid(IsometricMap.grid);



}

/*
Anzeige der Gebaeude fuer den CLient
Daten von starLocation2 werden Empfangen und verarbeitet
*/
function addLabor(scene) {
    scene.socket.on('labor', function (hqLocation) {
        if (teamname === 1) {
            laborImg = scene.add.image(hqLocation.x, hqLocation.y, 'labor').setInteractive();
            laborImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
            imageArray.push(laborImg);
            drawLabor(selectedTileX, selectedTileY, scene);
            resourceCounter -= 25;
            laborCounter++;

        } else if (teamname != 1) {
            laborImg = scene.add.image(hqLocation.x, hqLocation.y, 'labor2').setInteractive();
            laborImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
            imageArray.push(laborImg);
            drawLabor(selectedTileX, selectedTileY, scene);
            resourceCounter -= 25;
            laborCounter++;
        }
    });
}
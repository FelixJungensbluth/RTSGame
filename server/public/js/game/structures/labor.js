var laborImg = "none";
/*
  Darstellung der Kaserne

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
        "barracksIsSelected": false,
        "canBeSelected": false,
        "image": laborImg,
    }


    // Map Arrays werden geupdated
    this.buildingArray.push(labor);
    IsometricMap.buildingMap[Xi][Yi] = labor;
    IsometricMap.grid[Yi][Xi] = labor;

    // Wird auf der Map angezeigt 
    addBuilindsToMap(offY, offX);

    // Pathfinding Grid wird geupdated
    easystar.setAcceptableTiles([0]);
    easystar.setGrid(IsometricMap.grid);

    // selectedStatus des HQ wird an den Server gesendet 
    //scene.socket.emit('structureSelected', IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].isSelected);

}

/*
Anzeige der Gebaeude fuer den CLient
Daten von starLocation2 werden Empfangen und verarbeitet
*/
function addLabor(scene) {
    scene.socket.on('labor', function (hqLocation) {
        if (teamname === 1) {
            laborImg = scene.add.image(hqLocation.x, hqLocation.y, 'labor').setInteractive();
            imageArray.push(laborImg);
            drawLabor(selectedTileX, selectedTileY, scene);
           
        } else if (teamname != 1) {
            laborImg = scene.add.image(hqLocation.x, hqLocation.y, 'labor2').setInteractive();
            imageArray.push(laborImg);
            drawLabor(selectedTileX, selectedTileY, scene);
        }
    });
}
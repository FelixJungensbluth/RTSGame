var barrackImg = "none";
var isBuild = false;

/*
  Darstellung der Kaserne

  Die Position im 2D Array der Map wird in X & Y Koordinaten umgerechnet 
  Das Bild des HQ besitzt eine ID welche auch im Array gespeichret ist 

  Alle Infomationen ueber das HQ werden in einem Objekt gespeichert
  ID im Array wird durch das Objekt ersezt, damit man immer auf die Infos zugreifen kann

  Xi = X-Koordninate im Array der Map
  Yi = Y-Koordninate im Array der Map
*/
function drawBarracks(Xi, Yi, scene) {
  var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
  var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
  var barrack = {
    "id": "2",
    "name": "Kaserne",
    "baseHp": 1000,
    "currentHp": 500,
    "positionX": offX,
    "positionY": offY,
    "tileX": Xi,
    "tileY": Yi,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "barracksIsSelected": false,
    "canBeSelected": false,
    "image": barrackImg,
  }


  // Map Arrays werden geupdated
  this.buildingArray.push(barrack);

  IsometricMap.buildingMap[Xi][Yi] = barrack;
  IsometricMap.buildingMap[Xi - 1][Yi] = barrack;
  IsometricMap.buildingMap[Xi][Yi + 1] = barrack;
  IsometricMap.buildingMap[Xi - 1][Yi + 1] = barrack;

  IsometricMap.grid[Yi][Xi] = barrack;
  IsometricMap.grid[Yi + 1][Xi] = barrack;
  IsometricMap.grid[Yi][Xi - 1] = barrack;
  IsometricMap.grid[Yi + 1][Xi - 1] = barrack;

  // Wird auf der Map angezeigt 
  addBuilindsToMap(Xi, Yi);

  // Pathfinding Grid wird geupdated
  easystar.setAcceptableTiles([0]);
  easystar.setGrid(IsometricMap.grid);
}

/*
Anzeige der Gebaeude fuer den CLient
Daten von starLocation2 werden Empfangen und verarbeitet
*/
function addBarracks(scene) {
  scene.socket.on('barracks', function (hqLocation) {
    if (teamname === 1) {
      barrackImg = scene.add.image(hqLocation.x, hqLocation.y, 'kaserne').setInteractive();
      barrackImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
      imageArray.push(barrackImg);
      drawBarracks(selectedTileX, selectedTileY, scene);
    } else if (teamname != 1) {
      barrackImg = scene.add.image(hqLocation.x, hqLocation.y, 'kaserne2').setInteractive();
      barrackImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
      imageArray.push(barrackImg);
      drawBarracks(selectedTileX, selectedTileY, scene);
    }
    if (hqLocation.team == finalTeam) {
      resourceCounter -= 50;
    }
  });
}
var buildingTest = "dsfsdf";
var hqPosition;

var updatedHqPos;

/*
  Darstellung des HQ

  Die Position im 2D Array der Map wird in X & Y Koordinaten umgerechnet 
  Das Bild des HQ besitzt eine ID welche auch im Array gespeichret ist 

  Alle Infomationen ueber das HQ werden in einem Objekt gespeichert
  ID im Array wird durch das Objekt ersezt, damit man immer auf die Infos zugreifen kann

  Xi = X-Koordninate im Array der Map
  Yi = Y-Koordninate im Array der Map
*/
function drawHq(Xi, Yi) {
  var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
  var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
  var hq = {
    "id": "1",
    "name": "Hauptquartier",
    "positionX": offX,
    "positionY": offY,
    "tileX": Xi,
    "tileY": Yi,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "canBeSelected": false,
    "image": buildingTest,
  }

  hqPosition = { // TODO Send to server
    "x": offX,
    "y": offY,
    "team": teamname
  }

  scene.socket.emit('hqPosition', hqPosition);

  this.buildingArray.push(hq);
  IsometricMap.buildingMap[Xi][Yi] = hq;
  IsometricMap.grid[Yi][Xi] = hq;
  addBuilindsToMap(offY, offX);

  easystar.setAcceptableTiles([0]);
  easystar.setGrid(IsometricMap.grid);

}

function updatetest(Xi, Yi) {
  IsometricMap.test[Xi][Yi] = "Belegt";
  IsometricMap.grid = IsometricMap.test;

  console.log(IsometricMap.grid);
  console.log(IsometricMap.test);
  rotate(IsometricMap.grid);
  easystar.setGrid(IsometricMap.test);
}

/*
Anzeige der Gebaeude fuer den CLient
Daten von starLocation2 werden Empfangen und verarbeitet
*/
function addHq(scene) {
  scene.socket.on('hq', function (hqLocation) {
    if (teamname === 1) {
      buildingTest = scene.add.image(hqLocation.x, hqLocation.y, 'star').setInteractive();
      drawHq(selectedTileX, selectedTileY);
      // updatetest(selectedTileX, selectedTileY);
    } else {
      buildingTest = scene.add.image(hqLocation.x, hqLocation.y, 'turm2').setInteractive();
      drawHq(selectedTileX, selectedTileY);
      // updatetest(selectedTileX, selectedTileY);
    }

  });
}

function updateHqPosition() {
  scene.socket.on('hqUpdate', function (hqLocation) {
    updatedHqPos = { // TODO Send to server
      "x": hqLocation[0].x,
      "y": hqLocation[0].y,
      "team": teamname
    }
  });
}
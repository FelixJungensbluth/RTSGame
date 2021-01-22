var buildingTest = "dsfsdf";
var hqPosition;
var hqPositionTest;

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
    "baseHp": 500,
    "currentHp": 100,
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

  // Position des HQs wird an den Server gesendet 
  hqPosition = { // TODO Send to server
    "x": offX,
    "y": offY,
    "tileX": Xi,
    "tileY": Yi,
    "team": teamname
  }

  console.log(teamname);
  scene.socket.emit('hqPosition', hqPosition);

  // Map Arrays werden geupdated
  this.buildingArray.push(hq);
  IsometricMap.buildingMap[Xi][Yi] = hq;
  IsometricMap.grid[Yi][Xi] = hq;

  // Wird auf der Map angezeigt 
  addBuilindsToMap(offY, offX);

  // Pathfinding Grid wird geupdated
  easystar.setAcceptableTiles([0]);
  easystar.setGrid(IsometricMap.grid);
}

function updatetest(Xi, Yi) {
  IsometricMap.test[Xi][Yi] = "Belegt";
  IsometricMap.grid = IsometricMap.test;
  rotate(IsometricMap.grid);
  easystar.setGrid(IsometricMap.test);
}

/*
Anzeige der Gebaeude fuer den CLient
Daten von hqLocation werden Empfangen und verarbeitet
Resourcen weredn abgezogen
*/
function addHq(scene) {
  scene.socket.on('hq', function (hqLocation) {
    if (teamname === 1) {
      getHq()
      buildingTest = scene.add.image(hqLocation.x, hqLocation.y, 'star').setInteractive();
      drawHq(selectedTileX, selectedTileY);
      resourceCounter -= 50;
    } else if (teamname != 1) {
      getHq();
      buildingTest = scene.add.image(hqLocation.x, hqLocation.y, 'turm2').setInteractive();
      drawHq(selectedTileX, selectedTileY);
      resourceCounter -= 50;
    }
  });
}

// HQ Positon wird fuer alle Spieler geupdated
function updateHqPosition() {
  scene.socket.on('hqUpdate', function (hqLocation) {
    if (teamname === 1) {
      updatedHqPos = { // TODO Send to server
        "x": hqLocation[0].x,
        "y": hqLocation[0].y,
        "team": teamname
      }
    } else {
      updatedHqPos = { // TODO Send to server
        "x": hqLocation[hqLocation.length - 1].x,
        "y": hqLocation[hqLocation.length - 1].y,
        "team": teamname
      }
    }
  });
}

function getHq() {
  for (var i = 0; i < IsometricMap.buildingMap.length; i++) {
    for (var j = 0; j < IsometricMap.buildingMap.length; j++) {
      if (IsometricMap.buildingMap[i][j] != 0 && IsometricMap.buildingMap[i][j] != 5) {
        hqPositionTest = { // TODO Send to server
          "tileX": i,
          "tileY": j,
          "team": teamname
        }
      }
    }
  }
}
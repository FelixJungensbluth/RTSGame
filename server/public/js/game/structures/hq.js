var hqImg = "none";
var hqPosition;
var hqPositionTest;
var updatedHqPos;
var imageArray = new Array();
var updatedHqArray = new Array();

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
    "image": hqImg,
  }

  // Position des HQs wird an den Server gesendet 
  hqPosition = { // TODO Send to server
    "x": offX,
    "y": offY,
    "tileX": Xi,
    "tileY": Yi,
    "team": finalTeam
  }
  scene.socket.emit('hqPosition', hqPosition);

  // Map Arrays werden geupdated
  this.buildingArray.push(hq);

  IsometricMap.buildingMap[Xi][Yi] = hq;
  IsometricMap.buildingMap[Xi - 1][Yi] = hq;
  IsometricMap.buildingMap[Xi - 2][Yi] = hq;

  IsometricMap.buildingMap[Xi][Yi + 1] = hq;
  IsometricMap.buildingMap[Xi - 1][Yi + 1] = hq;
  IsometricMap.buildingMap[Xi - 2][Yi + 1] = hq;

  IsometricMap.buildingMap[Xi][Yi + 2] = hq;
  IsometricMap.buildingMap[Xi - 1][Yi + 2] = hq;
  IsometricMap.buildingMap[Xi - 2][Yi + 2] = hq;

  IsometricMap.grid[Yi][Xi] = hq;
  IsometricMap.grid[Yi + 1][Xi] = hq;
  IsometricMap.grid[Yi + 2][Xi] = hq;

  IsometricMap.grid[Yi][Xi - 1] = hq;
  IsometricMap.grid[Yi + 1][Xi - 1] = hq;
  IsometricMap.grid[Yi + 2][Xi - 1] = hq;

  IsometricMap.grid[Yi][Xi - 2] = hq;
  IsometricMap.grid[Yi + 1][Xi - 2] = hq;
  IsometricMap.grid[Yi + 2][Xi - 2] = hq;

  // Wird auf der Map angezeigt 
  addBuilindsToMap(Xi, Yi);

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
      hqImg = scene.add.image(hqLocation.x, hqLocation.y, 'star').setInteractive();
      hqImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
      imageArray.push(hqImg);
      drawHq(selectedTileX, selectedTileY, hqImg);
    } else if (teamname != 1) {
      getHq();
      hqImg = scene.add.image(hqLocation.x, hqLocation.y, 'turm2').setInteractive();
      hqImg.setDepth(IsometricMap.depth[selectedTileY][selectedTileX]);
      imageArray.push(hqImg);
      drawHq(selectedTileX, selectedTileY, hqImg);
    }
    if (hqLocation.team == finalTeam) {
      resourceCounter -= 75;
    }
  });
}

// HQ Positon wird fuer alle Spieler geupdated
function updateHqPosition() {
  scene.socket.on('hqUpdate', function (hqLocation) {
    hqLocation.forEach(element => {
      updatedHqArray.push(element);
    });


    updatedHqArray = uniq(updatedHqArray);
    if (finalTeam == 1) {
      updatedHqPos = { // TODO Send to server
        "x": hqLocation[0].x,
        "y": hqLocation[0].y,
        "team": teamname
      }
    } else {
      updatedHqPos = { // TODO Send to server
        "x": hqLocation[0].x,
        "y": hqLocation[0].y,
        "team": teamname
      }
    }

  });
}

function uniq(a) {
  const uniqueObjects = [...new Map(a.map(item => [item.team, item])).values()]
  sort(uniqueObjects);
  return (uniqueObjects);
}

function sort(array) {
  array.sort((a, b) => (a.team > b.team) ? 1 : -1)
}

/*
Position des Hqs auf der Map
*/
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
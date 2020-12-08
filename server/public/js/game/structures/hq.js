var buildingTest = "dsfsdf";

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

  this.buildingArray.push(hq);
  IsometricMap.buildingMap[Xi][Yi] = hq;
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
    } else {
      buildingTest = scene.add.image(hqLocation.x, hqLocation.y, 'turm2').setInteractive();
      drawHq(selectedTileX, selectedTileY);
    }

  });
}
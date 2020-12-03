// Darstellung des Hauptquartier
function drawHq(Xi, Yi) {
  var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
  var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
  
  if (teamname == "red") {
    building = scene.add.image(offX, offY, 'turm2').setInteractive();
    console.log("sdfsdfsdf");
  }

  var hq = {
    "id": "1",
    "name": "Hauptquartier",
    "positionX": offX,
    "positionY": offY,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "canBeSelected": false,
  }

  this.buildingArray.push(hq);
  IsometricMap.buildingMap[Xi][Yi] = hq;
}
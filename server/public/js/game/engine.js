var config = {
  type: Phaser.WEBGL,
  width: window.innerWidth - 15,
  height: window.innerHeight - 20,
  mousewheel: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};
var game = new Phaser.Game(config);

var tileWidthHalf;
var tileHeightHalf;

var scene;

var tileColumnOffset = 100; // pixels
var tileRowOffset = 50; // pixels

var originX = 480; // offset from left
var originY = 400; // offset from top

var Xtiles = 0; // Number of tiles in X-dimension
var Ytiles = 0; // Number of tiles in Y-dimension

var selectedTileX = 0;
var selectedTileY = 0;

var buildingPositionX = undefined; // X-Koordinate der platziereten Gebäude
var buildingPositionY = undefined; // Y-Koordinate der platziereten Gebäude

var name = "tiles"; // name der Tiles

var cam; // Camrea 

var zoom = 1; // Standart Zoomstufe

var camMoveX = 0; // Wert wie weit sich die Kamera in X-Richtung bewegt hat 
var camMoveY = 0 // Wert wie weit sich die Kamera in Y-Richtung bewegt hat 

var selectionRectWidth = 0; // Breite des Auswahlrechteckes
var selectionRectHeight = 0; // Höhe  des Auswahlrechteckes

var selectionRectangle; // Auswahlrechteck

var buildingArray = new Array(); // Array indem die platzierten Gebäude gespeichert werden

// Debug Text
var tilePosition;
var tileName;
var mousePosition;
var belegt;
var structureName;
var mausInfo;
var time;

var mausX;
var mausY;

var isSelected = false; // Boolean ob Gebaude ausgewaehlt ist 

var lastClicked = new Array(); // Array um Werte des letzten Mausklicks zu speichern 

var pressed = "none";

var selectedStructure;
var minutes;
var seconds;

var timeBar;
var timeBarBackGround;

var timedEvent;

var c = 0;

var clicked = false;

var healthBarArray = new Array();
var healthBarBackGroundArray = new Array();

let keyA;
let keyS;

var teamname = "none";



function preload() {
  this.buildingPositionX = new Array();
  this.buildingPositionY = new Array();
  this.tileImages = new Array();
  this.buildingsImages = new Array();
  this.load.image("star", "assets/turm.png");
  this.load.image("turm2", "assets/turm2.png");

  // Load all the images before we run the app
  for (var i = 0; i < IsometricMap.tiles.length; i++) {
    this.tileImages[i] = IsometricMap.tiles[i];
    name = i;
    this.load.image(name, IsometricMap.tiles[i]);
  }
}

function create() {
  scene = this;
  this.socket = io();
  this.players = this.add.group();
  this.input.setDefaultCursor('url(http://labs.phaser.io/assets/input/cursors/blue.cur), pointer');

  timedEvent = this.time.addEvent({
    delay: 500,
    callback: onEvent,
    callbackScope: this,
    loop: true
  });

  this.input.mouse.disableContextMenu();

  this.Xtiles = IsometricMap.map.length;
  this.Ytiles = IsometricMap.map[0].length;

  // Kamera
  var cam = this.cameras.main;
  cam.setZoom(1);
  moveCamera(this, cam);
  zoomCamera(this, cam);

  // Controles
  delteStructure(this);
  getLastClicked(this);

  // Infotext
  tilePosition = this.add.text(20, 20, 'Tile Position:', {
    fontSize: '15px',
    fill: '#fff'
  });
  mousePosition = this.add.text(20, 40, 'Mouse Position: ', {
    fontSize: '15px',
    fill: '#fff'
  });
  belegt = this.add.text(20, 60, 'Tile Status: ', {
    fontSize: '15px',
    fill: '#fff'
  });
  mausInfo = this.add.text(20, 80, 'Mausinfo: ', {
    fontSize: '15px',
    fill: '#fff'
  });

  time = this.add.text(1750, 20, 'Timer: ', {
    fontSize: '20px',
    fill: '#39ff14'
  });

  // Bestimmung des ausgewählten Tiles
  this.input.on('pointerdown', function (pointer) {
    if (lastClicked.length != 0) {
      mausInfo.setText('Mausbutton: ' + lastClicked[0].button + '\n' +
        'Zuletzt geklickte Tile Position X: ' + lastClicked[0].tilePositionX + '\n' +
        'Zuletzt geklickte Tile Position Y: ' + lastClicked[0].tilePositionY);
    }
  }, this);

  // Bestimming des aktuellen Tiles 
  this.input.on('pointermove', function (pointer) {
    mousePosition.setText('Mouse X: ' + pointer.x + ' Mouse Y: ' + pointer.y);
    mausX = pointer.x;
    mausY = pointer.y;

    if (pressed == "s") {
      selectedStructure.x = (mausX + camMoveX);
      selectedStructure.y = (mausY + camMoveY);
    }


    pointer.x = (pointer.x - tileColumnOffset / 2 - originX) + camMoveX;
    pointer.y = (pointer.y - tileRowOffset / 2 - originY) + camMoveY;
    tileX = Math.round(pointer.x / tileColumnOffset - pointer.y / tileRowOffset);
    tileY = Math.round(pointer.x / tileColumnOffset + pointer.y / tileRowOffset);

    selectedTileX = tileX;
    selectedTileY = tileY + 1;

    // InfoText
    tilePosition.setText('Tile X: ' + selectedTileX + ' Tile Y: ' + selectedTileY);
  }, this);

  // Platzierung der Gebäude
  if (IsometricMap.map[selectedTileX][selectedTileY].id !== 2) {

    placeBuilding(this);
  }


  // Map wrid gezeichnet   
  for (var Xi = (this.Xtiles - 1); Xi >= 0; Xi--) {
    for (var Yi = 0; Yi < this.Ytiles; Yi++) {
      drawTile(Xi, Yi);
    }
  }

  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.aKeyPressed = false;
  this.sKeyPressed = false;

  this.socket.on('starLocation2', function (starLocation) {
    if (teamname == "red") {
      scene.star = scene.add.image(starLocation.x, starLocation.y, 'turm2');
    } else {
      scene.star = scene.add.image(starLocation.x, starLocation.y, 'star');
    }

  });



  this.input.on('pointerdown', function (pointer) {
    console.log(teamname);
    if (pointer.leftButtonDown()) {

      if (!onRestrictedTile && !isSelected && pressed == "s") {

        drawHq(selectedTileX, selectedTileY);
      }

      this.socket.emit('mouse', {
        x: pointer.x,
        y: pointer.y,
        tileX: selectedTileX,
        tileY: selectedTileY
      });
      clicked = true;
    } else {
      clicked = false;
    }
  }, this);

  this.input.on('pointerup', function (pointer) {
    clicked = false;
  }, this);

  this.socket.on('updateTime', function (times) {
    displayTime(times.milSec);
  });

  this.socket.on('team', function (team) {
    teamname = team.name;
  });

  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });
}

// Ein Tile wird gezeichnet 
function drawTile(Xi, Yi) {
  var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
  var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

  var imageIndex = IsometricMap.map[Xi][Yi];
  var tileImage = scene.add.image(offX, offY, imageIndex).setInteractive();
  var tileObject = {
    "id": imageIndex,
    "image": tileImage,
  }
  IsometricMap.map[Xi][Yi] = tileObject;
}

function update(time) {


  test2();
  isPlacingAllowed();
  displayTime(time);
  this.socket.emit('playerInput', {
    mouse: clicked
  });

  const a = this.keyApressed;
  const s = this.keySpressed;

  if (keyA.isDown) {
    this.keyApressed = true;
    this.socket.emit('pressed', {
      pressed: "a"
    });
  } else if (keyS.isDown) {
    if (pressed == "none") {
      selectedStructure = scene.add.image(mausX + camMoveX, mausY + 8 + camMoveY, 'star').setInteractive();
    }
    pressed = "s"
    this.socket.emit('pressed', {
      pressed: "s"
    });
    this.keySpressed = true;
  } else {
    this.keyApressed = false;
    this.keySpressed = false;
  }
  if (a !== this.keyApressed || s !== this.keySpressed) {
    this.socket.emit('playerInput', {
      a: this.keyApressed,
      s: this.keySpressed
    });
  }
}

function test2() {
  if (selectedTileX >= 0 && selectedTileY >= 0 && selectedTileX < IsometricMap.buildingMap.length && selectedTileY <= IsometricMap.buildingMap.length) {
    if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 1) {
      belegt.setText('Tile Status: Belegt');
      isSelected = true;
    } else {
      isSelected = false;
      belegt.setText('Tile Status: frei');
    }
  }
}

function displayTime(milSec) {
  minutes = Math.floor((milSec / 1000) / 60);
  seconds = Math.floor((milSec / 1000) - (minutes * 60));
  scene.socket.on('updateTime', function (times) {
    time.setText('Timer: ' + minutes + ':' + seconds);
  });
}

function buildingTime(scene, sec) {

  timeBarBackGround = scene.add.rectangle(IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
    100, 10, 0xffffff);

  timeBar = scene.add.rectangle(IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX - 50,
    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
    0, 10, 0x39ff14);

  var buildInfo = {
    "buildingX": selectedTileX,
    "buildingY": selectedTileY,
    "background": timeBarBackGround,
    "progress": timeBar,
  }

  healthBarArray.push(buildInfo);

}

function isPlacingAllowed() {
  if (pressed == "s") {
    if (selectedTileX >= 0 && selectedTileY >= 0 && selectedTileX < IsometricMap.buildingMap.length && selectedTileY <= IsometricMap.buildingMap.length) {

      if ((IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 1 || IsometricMap.map[selectedTileX][selectedTileY].id === 2)) {
        selectedStructure.setTint(0xFF0040, 0.5);
        onRestrictedTile = true;
      } else {
        selectedStructure.clearTint();
        onRestrictedTile = false
      }
    }
  }

  console.log(onRestrictedTile);
}

function onEvent() {
  if (timeBar) {
    for (var i = 0; i < healthBarArray.length; i++) {
      if (healthBarArray[i].progress.width <= 100) {
        healthBarArray[i].progress.width += 10;
      }

      if (healthBarArray[i].progress.width == 100) {
        IsometricMap.buildingMap[healthBarArray[i].buildingX][healthBarArray[i].buildingY].canBeSelected = true;
        healthBarArray[i].progress.destroy();
        healthBarArray[i].background.destroy();
      }
    }
  }
}
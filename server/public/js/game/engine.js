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

// Variablen fuer die Bewegugn der Untis auf Resourcen
var follower;
var path1;
var graphics;

var tileWidthHalf;
var tileHeightHalf;

var scene;
var timer= 0;

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

var buildingArray = new Array(); // Array indem die platzierten Gebäude gespeichert werden

// Debug Text
var tilePosition;
var tileName;
var mousePosition;
var belegt;
var structureName;
var mausInfo;
var time;
var resources;

var resourceCounter = 100;

// Mauskoordianten fuer die Bewegung des Vorschaubildes des platzierten Objektes
var mausX;
var mausY;

var isSelected = false; // Boolean ob Gebaude ausgewaehlt ist 

var lastClicked = new Array(); // Array um Werte des letzten Mausklicks zu speichern 

var selectedStructure;

// Timer Variablen 
var minutes;
var seconds;

// Anzeige fuer die Bauszeit
var timeBar; // Zeitanzeige
var timeBarBackGround; // Hintergrund
var healthBarArray = new Array(); // Speicherung aller Bauzeitanzeigen
var healthBarBackGroundArray = new Array(); // Speicherung aller Bauzeitanzeigen Backgrounds

var timedEvent; // Variable fuer ein Timer

var clicked = false; // Boolean ob eine Maustaste benutzt wurde

// Keyinput
let keyA; // Variable fuer die Taste A
let keyS; // Variable fuer die Taste S
let keyD; // Variable fuer die Taste S
let keyQ;
let keyX;
var pressed = "none"; // String der speichert weilche Taste gedrueckt wurde 

var teamname = "none"; // String in welchem Team der Spieler ist (Im Moment Rot oder Blau)

var tileStatus = false;

var selectedStatus = false;

var workerX;
var workerY;

var soliderX;
var soliderY;

var easystar;

var testRect; // Pathfinnding

function preload() {

  //Arrays werden initalisiert
  this.buildingPositionX = new Array();
  this.buildingPositionY = new Array();
  this.tileImages = new Array();
  this.buildingsImages = new Array();

  // Bilder fuer das HQ wird geladen 
  this.load.image("star", "assets/turm.png");
  this.load.image("turm2", "assets/turm2.png");
  this.load.image("kaserne", "assets/kaserne.png");
  this.load.image("kaserne2", "assets/kaserne2.png");
  this.load.image("mine", "assets/mine.png");
  this.load.image("solider", "assets/solider.png");
  this.load.image("worker", "assets/worker1.png");
  this.load.image("minimap", "assets/map.png");
  this.load.image("olMap", "assets/HUD_map.png");
  this.load.image("olTime", "assets/HUD_time.png");
  this.load.image("olResource", "assets/HUD_resources.png");
  this.load.image("cursur", "assets/normal.cur");

  this.load.image("win", "assets/win.png");
  this.load.image("lose", "assets/lose.png");

  this.load.image("settings", "assets/menuBackground.png");
  this.load.image("surrender", "assets/menuButton2.png");
  this.load.image("range", "assets/menuButton1.png");

  this.load.spritesheet('boom', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
  this.load.spritesheet('boom2', 'assets/dmg.png', { frameWidth: 16, frameHeight: 16, endFrame: 23 });

  // Alle Bilder der Tiles werden geladen 
  for (var i = 0; i < IsometricMap.tiles.length; i++) {
    this.tileImages[i] = IsometricMap.tiles[i];
    name = i;
    this.load.image(name, IsometricMap.tiles[i]);
  }
}

/*
  Methode wird bei Start der anwendung ausgefuehrt 
*/
function create() {
  scene = this;
  graphics = this.add.graphics();
  follower = {
    t: 0,
    vec: new Phaser.Math.Vector2()
  };
  path1 = this.add.path();
  this.players = this.add.group();
  easystar = new EasyStar.js();

  //SocketIO wird initalisiert 
  this.socket = io();

  //Custom Cursor wird festeglegt 

  // Oeffnen des Rechtsklickmenue wird disabled
  this.input.mouse.disableContextMenu();

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {

      if (players[id].playerId === scene.socket.id) {
        //console.log("test");
      } else {
        // console.log("test1");
      }
    });
  });

  // Timer wrid erzeugt
  timedEvent = this.time.addEvent({
    delay: 500,
    callback: onEvent,
    callbackScope: this,
    loop: true
  });

  // Anzahl der Tiles in X und Y Richtung wird festgelegt 
  // Basierend auf dem 2D Array der Map
  this.Xtiles = IsometricMap.map.length;
  this.Ytiles = IsometricMap.map[0].length;

  // Kamera
  var cam = this.cameras.main;
  cam.setZoom(1);
  moveCamera(this, cam);
  // Controles
  getLastClicked(this);

  // Infotext
  tilePosition = this.add.text(20, 140, 'Tile Position:', {
    fontSize: '15px',
    fill: '#fff'
  }).setScrollFactor(0);
  mousePosition = this.add.text(20, 160, 'Mouse Position: ', {
    fontSize: '15px',
    fill: '#fff'
  }).setScrollFactor(0);
  belegt = this.add.text(20, 180, 'Tile Status: ', {
    fontSize: '15px',
    fill: '#fff'
  }).setScrollFactor(0);
  mausInfo = this.add.text(20, 200, 'Mausinfo: ', {
    fontSize: '15px',
    fill: '#fff'
  }).setScrollFactor(0);
  addBuildingOnMap(scene);

  // Bestimmung des ausgewählten Tiles
  this.input.on('pointerdown', function (pointer) {
    if (lastClicked.length != 0) {
      mausInfo.setText('Mausbutton: ' + lastClicked[0].button + '\n' +
        'Zuletzt geklickte Tile Position X: ' + lastClicked[0].tilePositionX + '\n' +
        'Zuletzt geklickte Tile Position Y: ' + lastClicked[0].tilePositionY);
    }
  }, this);

  createSelectionRectangle(scene);

  // Bestimming des aktuellen Tiles 
  this.input.on('pointermove', function (pointer) {
    // InfoText
    mousePosition.setText('Mouse X: ' + pointer.x + ' Mouse Y: ' + pointer.y);
    if (lastClicked.length != 0) {
      if (lastClicked[0].button == "rechts") {
        selectionRectangle.width = (pointer.x - lastClicked[0].positionX) + camMoveX;
        selectionRectangle.height = (pointer.y - lastClicked[0].positionY) + camMoveY;
      }
    }

    // Mauspositon wird den Variablen zugewiesen
    mausX = pointer.x;
    mausY = pointer.y;

    // Wenn S gedreuckt wird die Position des Vorschaugebaudes auf die Mausposition gleichgezsetzt
    // Die Differenz vom Mittlepunkt der Szene zu der Distanz welche sich die Kamera bewegt hat wird mit einberechent  
    if (pressed == "s" || pressed == "d") {
      selectedStructure.x = (mausX + camMoveX);
      selectedStructure.y = (mausY + camMoveY);
    }

    // Die Mausposition wird in eine Positon im 2D Array der Map umgerechnet 
    // Die Differenz vom Mittlepunkt der Szene zu der Distanz welche sich die Kamera bewegt hat wird mit einberechent  
    pointer.x = (pointer.x - tileColumnOffset / 2 - originX) + camMoveX;
    pointer.y = (pointer.y - tileRowOffset / 2 - originY) + camMoveY;
    tileX = Math.round(pointer.x / tileColumnOffset - pointer.y / tileRowOffset);
    tileY = Math.round(pointer.x / tileColumnOffset + pointer.y / tileRowOffset);

    // Aktuelle Positon im 2D Array wird in den jeweiligen Variablen gespiechert
    selectedTileX = tileX;
    selectedTileY = tileY + 1;

    // InfoText
    tilePosition.setText('Tile X: ' + selectedTileX + ' Tile Y: ' + selectedTileY);

    this.socket.emit('mouse', {
      x: pointer.x,
      y: pointer.y,
      tileX: selectedTileX,
      tileY: selectedTileY
    });
  }, this);

  // Platzierung der Gebäude
  if (IsometricMap.map[selectedTileX][selectedTileY].id !== 2) {
    placeBuilding(this);
  }

  /*
    Das 2D Array der Map wird mit hilfe von 2 for-Schleifen durchlaufen 
    Die Indexe der forschleifen dienen als Koordinaten fuer die Tiles 
  */
  for (var Xi = (this.Xtiles - 1); Xi >= 0; Xi--) {
    for (var Yi = 0; Yi < this.Ytiles; Yi++) {
      drawTile(Xi, Yi);
    }
  }

  // Minimap
  createMap(scene);

  // Overlay
  displayOverlay();
  settings();

  // Zeittext
  time = this.add.text(75, 1, '', {
    font: "23px Arial",
    fill: '#000000',
  }).setScrollFactor(0);

  // Resourcen Text
  resources = this.add.text(130, 35, '0', {
    font: "20px Arial",
    fill: '#000000',
  }).setScrollFactor(0);

  // Initialisierung der Keyinput variablen 
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  this.aKeyPressed = false;
  this.sKeyPressed = false;
  this.dKeyPressed = false;
  this.qKeyPressed = false;
  this.xKeyPressed = false;

  // Daten fuer die Informationen ueber das Team werden vom Server empfangen 
  // Der Teamname jedes Spielers wird in der Variable gespeichert 
  this.socket.on('team', function (team) {
    teamname = team.name;
  });

  /*
  Mausinformationen werden von jedem Spieler an den Server gesendet 
  Im Moment werden die Daten nur fuer die Linke Maustaste gesendet

  X & Y Koordinaten 
  TileX & TileY Koordanitan 
  Clicked = Setzt ein Boolean auf True wenn die Maustaste gedrueckt worden ist
  */
  this.input.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {

      // Mausinfos werden an den Server gesendend 
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

  // Fuegt das HQ zu der Scene hinzu
  addHq(scene);
  updateHqPosition(scene);

  // Fuegt das Kaserne zu der Scene hinzu
  addBarracks(scene);

  // Fuegt den Arbeiter zu der Scene hinzu
  addWorker(scene);
  addSolider(scene);
  selectUnits(scene);
  dgfdjkgdkjflg();
  handleUnitMovment(scene);
  handelSelectedUnits(scene);
  unitsSelected(scene);
  attack2();
  moveTest();

  showAttackRange(scene);



  // Check ob ein Tile belegt ist
  this.socket.on('checkTileStatus', function (status) {
    tileStatus = status;
  });

  // Wenn die Maustaste nicht mehr gedrueckt wird, wird cliecked auf false gesetzt 
  this.input.on('pointerup', function (pointer) {
    clicked = false;
  }, this);

  // Daten fuer die Spielzeit anzeige werden vom Server empfangen und in der Methode displattime() verarbeitet
  this.socket.on('updateTime', function (times) {
    displayTime(times.milSec);
  });

  // Zeigt nicht begebare Tiles auf der Map an (rot);
  visualizeGrid();
  updateSelect(scene);
  globalDamagePos();
  setWinner();
 
}

// Rotiert und Spieglet die uebergebene Matrix 
function rotate(matrix) {
  // reverse the individual rows
  matrix = matrix.reverse();

  // swap the symmetric elements
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  // spiegeln
  matrix = matrix.map(function (row) {
    return row.reverse();
  });
}

/*
  Die Position im 2D Array der Map wird in X & Y Koordinaten umgerechnet 
  Das Bild der jeweiligen Tiles besitzt eine ID welche auch im Array gespeichret ist 

  Die Id des Tiles wird durch ein Objekt mit Infomtionen ueber die ID und des jweiligen Bildes erstezt,
  da man so immer auf das zugehoerige Bild zugreifen kann 

  Xi = X-Koordninate im Array der Map
  Yi = Y-Koordninate im Array der Map
*/
function drawTile(Xi, Yi) {

  // Umrechnung der Koordinaten
  var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
  var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

  // Anzeige des Bildes
  var imageIndex = IsometricMap.map[Xi][Yi];
  var tileImage = scene.add.image(offX, offY, imageIndex).setInteractive();

  // Erstellung eines Objktes mit Infomtionen ueber jedes Tile
  var tileObject = {
    "id": imageIndex,
    "image": tileImage,
    "positionX": offX,
    "positionY": offY,
  }

  // Diese Objekt wird in das Array der Map eingefuegt 
  IsometricMap.map[Xi][Yi] = tileObject;
}

// Methode die 60/s ausgefuehrt wird 
function update(time, delta) {


  //Check ob ein Tile belegt ist und man ein Objekt platzieren kann
  checkTileStatus(this);
  isPlacingAllowed();
  hp();
  updateHp();
  // Zeigt die Zeit an
  displayTime(time);

  // Sammeln von Resourcen | Bewegen der Units zwischen HQ und Resourcen
  collectResources();
  moveOnResource();

  displayAttack();

  updateMap();
 
  // Update Resourceanzeige
  timer += delta;
 
  while (timer > 1000) {
    resourceCounter += unitsOnResource;
    doDamage(this);
    timer -= 1000;
  }
  this.socket.emit('resource', resourceCounter);
  resources.setText(resourceCounter);

  // Daten ob die Maus gedrueckt worden ist wird an denServer geschickt 
  this.socket.emit('playerInput', {
    mouse: clicked
  });

  //KeyboardInput
  const a = this.keyApressed;
  const s = this.keySpressed;
  const d = this.keyDpressed;
  const q = this.keyQpressed;
  const x = this.keyQpressed;

  // Wenn A gedrueckt ist
  if (keyA.isDown) {
    this.keyApressed = true;
    this.socket.emit('pressed', {
      pressed: "a"
    });
    // Wenn S gedrueckt ist
  } else if (keyS.isDown) {
    if (pressed == "none") {
      selectedStructure = scene.add.image(mausX + camMoveX, mausY + 8 + camMoveY, 'star').setInteractive();
    }
    pressed = "s"
    this.socket.emit('pressed', {
      pressed: "s"
    });
    this.keySpressed = true;

  } else if (keyD.isDown) {
    if (pressed == "none" && IsometricMap.buildingMap[hqPositionTest.tileX][hqPositionTest.tileY].isSelected) {
      selectedStructure = scene.add.image(mausX + camMoveX, mausY + 8 + camMoveY, 'kaserne').setInteractive();
    }
    pressed = "d"
    this.socket.emit('pressed', {
      pressed: "d"
    });
    this.keyDpressed = true;

  } else if (keyQ.isDown) {
    this.keyQpressed = true;
    this.socket.emit('pressed', {
      pressed: "q"
    });

  } else if (keyX.isDown) {
    this.keyXpressed = true;
    this.socket.emit('pressed', {
      pressed: "x"
    });
    pressed = "x"
    this.input.setDefaultCursor('url(assets/text.cur), pointer');
    // Wenn S gedrueckt ist
  } else {
    if (pressed == "x") {
      pressed = "none";
      this.socket.emit('pressed', {
        pressed: "none"
      });
    }
    this.keyApressed = false;
    this.keyDpressed = false;
    this.keySpressed = false;
    this.keyQpressed = false;
    this.keyXpressed = false;
    this.input.setDefaultCursor('url(assets/normal.cur), pointer');
  }

  // Daten ueber KeyboardInput werden an den Server geschickt 
  if (a !== this.keyApressed) {
    this.socket.emit('playerInput', {
      a: this.keyApressed,
    });
  }

  if (q !== this.keyQpressed) {
    this.socket.emit('playerInput', {
      q: this.keyQpressed,
    });
  }
}

/*
Check zuerst ob die Mauspositon auf der dargestellten Map ist 
Wenn auf der derzeitigen Position ein Gebauede mit der ID 1 befindent wird dieses Tile als belegt festgelegt 
*/
function checkTileStatus() {

  // Wenn auf der derzeitigen Position ein Gebauede mit der ID 1 befindent wird dieses Tile als belegt festgelegt 
  if (tileStatus) {
    belegt.setText('Tile Status: Belegt');
    isSelected = true;
  } else {
    isSelected = false;
    belegt.setText('Tile Status: frei');
  }
}

/*
  Die Update Methode bietet die Moeglichkeit die vergangene Zeit seit Start der Anwenung in Milisec auszugeben 
  Die Zeit wird vom Server an die jeweiligen Clients gesendet 
  Umrechnung der Milisec in Minuten und Sekunde
*/
function displayTime(milSec) {

  //  Umrechnung der Milisec in Minuten und Sekunde
  minutes = Math.floor((milSec / 1000) / 60);
  seconds = Math.floor((milSec / 1000) - (minutes * 60));

  // Zeitinfomrationen werden vom Client empfangen
  scene.socket.on('updateTime', function (times) {

    // Text wird gesetzt 
    time.setText(minutes + ':' + seconds);
  });
}

/*
  Mehtode fuer die Anzeige der Bauzeit 
  Besteht aus 2 Teilen: Anzeige und Hintergrund
  Informationen fuer die Anzeige wird in einem Objekt gespeichert
  Alle Anzeigen werden in einem Array gespeichert 
*/
function buildingTime(scene) {

  // Hintergrund
  timeBarBackGround = scene.add.rectangle(IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
    100, 10, 0xffffff);

  // Anzeige 
  timeBar = scene.add.rectangle(IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX - 50,
    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
    0, 10, 0x4169E1);

  var buildInfo = {
    "buildingX": selectedTileX,
    "buildingY": selectedTileY,
    "background": timeBarBackGround,
    "progress": timeBar,
  }

  healthBarArray.push(buildInfo);

}

/*
Check zuerst ob die Mauspositon auf der dargestellten Map ist 
Objekte koenne nur platziert werden wenn die Tile ID nicht 2 ist oder das Tile schon belegt ist 
Wenn das Tile belegt ist wird die Vorschauobjekt rot gefaerbt
*/
function isPlacingAllowed() {
  if (pressed == "s" || pressed == "d") {
    if (selectedTileX >= 0 && selectedTileY >= 0 && selectedTileX < IsometricMap.buildingMap.length && selectedTileY <= IsometricMap.buildingMap.length) {
      if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 1 ||
        IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 2 ||
        IsometricMap.map[selectedTileX][selectedTileY].id === 2 ||
        IsometricMap.map[selectedTileX][selectedTileY].id === 50) {
        selectedStructure.setTint(0xFF0040, 0.5);
        onRestrictedTile = true;
      } else {
        selectedStructure.clearTint();
        onRestrictedTile = false
      }
    }
  }
}

/*
Animation der Bauzeitanzeige 
*/
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
/*
Visualisieren des Grids
*/
function visualizeGrid() {
  for (var i = 0; i < IsometricMap.grid.length; i++) {
    for (var j = 0; j < IsometricMap.grid.length; j++) {
      if (IsometricMap.grid[i][j] == 5) {
        IsometricMap.map[j][i].image.setTint(0xFF0040, 0.5);
      }
    }
  }
}

function setWinner() {
  scene.socket.on('winnerStatus', function (team) {
    canMoveCam = false;
    if (team && !win) {
      console.log("LOISTLOSTLSOTSOLT");
      var lose = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'lose').setScrollFactor(0);
      lose.setInteractive();
      lose.on('pointerdown', () => {
        window.open('http://localhost:3000/test.html')
      }, this);
    } else {

      var winImg = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'win').setScrollFactor(0);
      winImg.setInteractive();
      winImg.on('pointerdown', () => {
        window.open('http://localhost:3000/test.html')
      }, this);
    }
  });

  scene.socket.on('loserStatus', function (team) {
    canMoveCam = false;
    if (team && lose) {
      console.log("LOISTLOSTLSOTSOLT");
      var loseImg = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'lose').setScrollFactor(0);
      loseImg.setInteractive();
      loseImg.on('pointerdown', () => {
        window.open('http://localhost:3000/test.html')
      }, this);
    } else {

      var winImg = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'win').setScrollFactor(0);
      winImg.setInteractive();
      winImg.on('pointerdown', () => {
        window.open('http://localhost:3000/test.html')
      }, this);
    }
  });
}

function updateMap() { 
  scene.socket.on('updateMap', function (map) {
    IsometricMap.buildingMapAll = map;

  });
}
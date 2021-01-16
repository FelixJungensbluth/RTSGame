const players = {};

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

var tileColumnOffset = 100; // pixels
var tileRowOffset = 50; // pixels

var originX = 480; // offset from left
var originY = 400; // offset from top

var Xtiles = 0; // Number of tiles in X-dimension
var Ytiles = 0; // Number of tiles in Y-dimension

var buildingArray = new Array();

var team = 0;

selectedStatus = false
var easystar;

var onlyOnce = true;

var fuck = new Array;

var mental = new Array;

var mental = new Array;

var buildingsOnMap = new Array;

var updatedPos = new Array;
var hq = new Array();


function preload() {
  this.load.image('ship', 'assets/spaceShips_001.png');
  this.load.image('star', 'assets/star_gold.png');
}

/*
  Methode wird bei Start der anwendung ausgefuehrt 
*/
function create() {
  const self = this;
  this.players = this.physics.add.group();
  easystar = new EasyStar.js();
  easystar.setAcceptableTiles([0]);
  easystar.setGrid(IsometricMap.grid);

  // Objekt mit Mausinfos
  this.mouseInfo = {
    x: 0,
    y: 0,
    tileX: 0,
    tileY: 0,

  }

  // Objekt mit Infos welche Taste gedrueckt worden ist
  this.presesdInfo = {
    pressed: "none"

  }

  // Zeitobjekt
  this.times = {
    milSec: 0
  }

  // Teamobject
  this.team = {
    name: "none"
  }

  this.workerPosition = {
    x: 0,
    y: 0,
  }

  self.times.milSec = 10;

  // Das Zeit objekt wird an die Clients gesended 
  io.emit('updateTime', self.times);

  /*
    Wenn ein Spieler connectet wird ein Objekt des Spieler mit allen Infos erzeugt 
  */
  io.on('connection', function (socket) {
    console.log('a user connected');
    team++;
    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue',
      team1: team,
      input: {
        a: false,
        s: false,
        mouse: false
      },
      test: {
        pressed: "none"
      },
      unit: testArray = new Array(),
      path: pathArray = new Array()
    };

    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    // send the star object to the new player
    // send the current scores
    socket.emit('updateTime', self.times);

    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });

    // Die gesendeten Mausinputs von den Clients werden mit den Variablen des Serves geleichgesetzt
    socket.on('mouse', function (mouseData) {
      self.mouseInfo.x = mouseData.x;
      self.mouseInfo.y = mouseData.y;
      self.mouseInfo.tileX = mouseData.tileX;
      self.mouseInfo.tileY = mouseData.tileY;
      onlyOnce = true;
    });

    // Die gesendeten Keyboardinputs von den Clients werden mit den Variablen des Serves geleichgesetzt
    socket.on('pressed', function (presesdData) {
      handleKeyPressed(self, socket.id, presesdData)
    });

    socket.on('structureSelected', function (selected) {
      selectedStatus = selected;
    });

    socket.on('MOVE', function (move) {
      fuck.push(move);
    });

    socket.on('selctedUnitID', function (sUId) {
      mental.push(sUId);
    });

    socket.on('onMap', function (mapCords) {
      buildingsOnMap.push(mapCords);
    });

    socket.on('updatePosResource', function (pos) {
      updatedPos.push(pos);
    });

    socket.on('hqPosition', function (hqPos) {
      hq.push(hqPos);
    });
  });
}

// Methode die 60/s ausgefuehrt wird 
function update(time) {
  // Die Inputs fuer jeden Client werden verarbeitet 
  this.players.getChildren().forEach((player) => {
    const input = players[player.playerId].input;
    const pressed = players[player.playerId].test.pressed;

    this.team.name = players[player.playerId].team1
    io.emit('team', this.team);

    console.log(pressed);

    if (input.mouse && pressed == "s" && !onRestrictedTile) {
      addHq(this);
      io.emit('allBuildingsOnMap', buildingsOnMap);
      io.emit('hqUpdate', hq);
    }

    if (input.a && selectedStatus) {
      addWorker(this, players[player.playerId].unit, this.team);
      this.presesdInfo.pressed == "none"
    }

    if (onlyOnce) {
      if (input.mouse) {
        io.emit("break", mental);
        mental.length = 0;
        io.emit("resourcePos", updatedPos);
        io.emit("FUCKINFO", fuck);
        updatedPos.length = 0;

        onlyOnce = false;
      }
    }

    if (input.mouse) {
      //console.log(players[player.playerId].team);
      if (!onRestrictedTile) {
        players[player.playerId].test.pressed = "none";
      }

    } else if (this.presesdInfo.pressed == "a") {

    }
  });
  io.emit('playerUpdates', players);

  this.times.milSec = time;
  io.emit('updateTime', this.times);
  io.emit('currentPlayers', players);

  isPlacingAllowed(this);
}

// Daten zu den Inputs werden in den Variablen des Servers gespeichert
function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
    }
  });
}

// Daten zu den Inputs werden in den Variablen des Servers gespeichert
function handleKeyPressed(self, playerId, pressedData) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].test = pressedData;
    }
  });
}

function handelPathInfo(self, playerId, path) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].path = path;
    }
  });
}

function handelUnitInfo(self, playerId, unit) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].unit = unit;
    }
  });
}

// Spieler wird hinzugefuegt und mit einer ID versehen 
function addPlayer(self, playerInfo) {
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

// Erster Versuch das HQ zu platzieren 
function addHq(self) {
  console.log(self.mouseInfo.x + ' ' + self.mouseInfo.y + ' ' + self.mouseInfo.tileX + ' ' + self.mouseInfo.tileY);
  var offX = self.mouseInfo.tileX * this.tileColumnOffset / 2 + self.mouseInfo.tileY * this.tileColumnOffset / 2 + this.originX;
  var offY = self.mouseInfo.tileY * this.tileRowOffset / 2 - self.mouseInfo.tileX * this.tileRowOffset / 2 + this.originY;
  var test = self.physics.add.image(offX, offY, 'star');
  io.emit('hq', {
    x: offX,
    y: offY
  });
  var hq = {
    "id": "1",
    "name": "Hauptquartier",
    "positionX": offX,
    "positionY": offY,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "image": test,
    "canBeSelected": false,
  }

  this.buildingArray.push(hq);
  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY] = hq;
  IsometricMap.grid[self.mouseInfo.tileY][self.mouseInfo.tileY] = hq;

  easystar.setAcceptableTiles([0]);
  easystar.setGrid(IsometricMap.grid);
}

function addWorker(self) {
  worker = self.add.image(Phaser.Math.RND.between(800, 200), Phaser.Math.RND.between(1000, 200), 'star').setInteractive();
  io.emit('workerLocation', {
    x: 760,
    y: 345,
  });
}

// Gleiche wie in Engine
function isPlacingAllowed(self) {

  if (self.mouseInfo.tileX >= 0 && self.mouseInfo.tileY >= 0 && self.mouseInfo.tileX < IsometricMap.buildingMap.length && self.mouseInfo.tileY <= IsometricMap.buildingMap.length) {
    if ((IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY].id == 1 || IsometricMap.map[self.mouseInfo.tileX][self.mouseInfo.tileY] === 2)) {
      onRestrictedTile = true;
      io.emit('checkTileStatus', onRestrictedTile);
    } else {
      io.emit('checkTileStatus', onRestrictedTile);
      onRestrictedTile = false
    }
  }

  // console.log(onRestrictedTile);
}

// Spieler wird entfernt 
function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}

const game = new Phaser.Game(config);
window.gameLoaded();
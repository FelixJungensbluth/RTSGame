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

var selectedStatus = false;
var selectedStatusBarracks = false;
var easystar;

var onlyOnce = true;
var onlyOnce2 = true;
var fuck = new Array;

var mental = new Array;

var mental = new Array;

var buildingsOnMap = new Array;

var updatedPos = new Array;
var hq = new Array();

var attackLines = new Array();

var winner;
var surrender;

var dmg = new Array();

var globalStructurs = new Array();

var attackedUnits = new Array();

var readyPlayers = new Array();


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
        q: false,
        w: false,
        mouse: false
      },
      test: {
        pressed: "none"
      },
      resources: 100,
      hqCount: 0,
      hqSelected: false,

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
      // selectedStatus = selected;
      handlSelectedStatus(self, socket.id, selected)
    });

    socket.on('structureSelectedBarracks', function (selected) {
      selectedStatusBarracks = selected;
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

    socket.on('resource', function (counter) {
      handlePlayerResouces(self, socket.id, counter)
    });

    socket.on('attack', function (lines) {
      attackLines.push(lines);
    });

    socket.on('win', function (win) {
      winner = win;
    });

    socket.on('lose', function (lose) {
      surrender = lose;
    });

    socket.on('damagePositon', function (pos) {
      dmg.push(pos);
    });

    socket.on('updateBuildings', function (buildings) {
      buildings.forEach(sdfg => {
        globalStructurs.push(sdfg);
      })

    });

    socket.on('unitsAttacked', function (units) {
      attackedUnits.push(units);

    });

    socket.on('ready', function (team) {
      // selectedStatus = selected;
      handleReadyCheck(self, socket.id)
    });

  });
}

// Methode die 60/s ausgefuehrt wird 
function update(time) {
  // Die Inputs fuer jeden Client werden verarbeitet 
  this.players.getChildren().forEach((player) => {
    const input = players[player.playerId].input;
    const pressed = players[player.playerId].test.pressed;
    const resource = players[player.playerId].resources;
    const test = players[player.playerId].hqSelected;

    this.team.name = players[player.playerId].team1

    io.emit('team', this.team);

    if (input.mouse && pressed == "s" && !onRestrictedTile && resource > 50 && players[player.playerId].hqCount == 0) {
      addHq(this, this.team, players[player.playerId].team1);
      players[player.playerId].hqCount++;
      console.log(players[player.playerId].hqCount);

      io.emit('allBuildingsOnMap', buildingsOnMap);
      io.emit('hqUpdate', hq);
      io.emit('updateMap', IsometricMap.buildingMap);
      io.emit('global', globalStructurs);
    }

    if (input.mouse && pressed == "d" && !onRestrictedTile && test) {
      //if (input.mouse && pressed == "d" && !onRestrictedTile && resource > 0 && test) {
      addBarracks(this);
      io.emit('allBuildingsOnMap', buildingsOnMap);
      io.emit('updateMap', IsometricMap.buildingMap);
      io.emit('global', globalStructurs);
    }

    if (input.mouse && pressed == "e" && !onRestrictedTile && test) {
      //if (input.mouse && pressed == "d" && !onRestrictedTile && resource > 0 && test) {
      addLabor(this);
      io.emit('allBuildingsOnMap', buildingsOnMap);
      io.emit('updateMap', IsometricMap.buildingMap);
      io.emit('global', globalStructurs);
    }

    if (input.a && test) {
      addWorker(this, players[player.playerId].unit, this.team);
      this.presesdInfo.pressed == "none"
    }

    if (input.q && test) {
      addSolider(this, players[player.playerId].unit, this.team);
      this.presesdInfo.pressed == "none"
    }

    if (input.w && test) {
      addTank(this, players[player.playerId].unit, this.team);
      this.presesdInfo.pressed == "none"
    }

    if (onlyOnce) {
      if (input.mouse && pressed == "x") {
        console.log('ATTACL');
        io.emit("attackBreak", attackLines);
        io.emit("testDmg", dmg);
        io.emit("attackedUnits", attackedUnits);
        onlyOnce = false;
        attackLines.length = 0;

      }
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

  if (onlyOnce2) {
    if (winner) {
      io.emit('winnerStatus', winner);
      onlyOnce2 = false;
    }

    if (surrender) {
      io.emit('loserStatus', surrender);
      onlyOnce2 = false;
    }
  }

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

// Daten zu den Inputs werden in den Variablen des Servers gespeichert
function handlePlayerResouces(self, playerId, counter) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].resources = counter;
    }
  });
}

// Daten zu den Inputs werden in den Variablen des Servers gespeichert
function handlSelectedStatus(self, playerId, status) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].hqSelected = status;
    }
  });
}

function handleReadyCheck(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      //  console.log(players[player.playerId].team1);
      readyPlayers.push(players[player.playerId].team1);
      readyPlayers = uniq(readyPlayers);

      io.emit('readyRec', readyPlayers.length);
    }
  });
}

function uniq(a) {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

// Spieler wird hinzugefuegt und mit einer ID versehen 
function addPlayer(self, playerInfo) {
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

// Erster Versuch das HQ zu platzieren 
function addHq(self, test1, teamNum) {
  console.log(self.mouseInfo.x + ' ' + self.mouseInfo.y + ' ' + self.mouseInfo.tileX + ' ' + self.mouseInfo.tileY);
  var offX = self.mouseInfo.tileX * this.tileColumnOffset / 2 + self.mouseInfo.tileY * this.tileColumnOffset / 2 + this.originX;
  var offY = self.mouseInfo.tileY * this.tileRowOffset / 2 - self.mouseInfo.tileX * this.tileRowOffset / 2 + this.originY;
  var test = self.physics.add.image(offX, offY, 'star');
  io.emit('hq', {
    x: offX,
    y: offY,
    team: test1

  });
  var hq = {
    "id": "1",
    "name": "hq",
    "team": teamNum,
    "positionX": offX,
    "positionY": offY,
    "baseHp": 100,
    "currentHp": 100,
    "tileX": self.mouseInfo.tileX,
    "tileY": self.mouseInfo.tileY,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "image": test,
    "canBeSelected": false,
    "damage": 0,
  }

  this.buildingArray.push(hq);

  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 2][self.mouseInfo.tileY] = hq;

  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY + 1] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY + 1] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 2][self.mouseInfo.tileY + 1] = hq;

  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY + 2] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY + 2] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 2][self.mouseInfo.tileY + 2] = hq;

}

// Erster Versuch das HQ zu platzieren 
function addBarracks(self) {
  console.log(self.mouseInfo.x + ' ' + self.mouseInfo.y + ' ' + self.mouseInfo.tileX + ' ' + self.mouseInfo.tileY);
  var offX = self.mouseInfo.tileX * this.tileColumnOffset / 2 + self.mouseInfo.tileY * this.tileColumnOffset / 2 + this.originX;
  var offY = self.mouseInfo.tileY * this.tileRowOffset / 2 - self.mouseInfo.tileX * this.tileRowOffset / 2 + this.originY;
  var test = self.physics.add.image(offX, offY, 'star');
  io.emit('barracks', {
    x: offX,
    y: offY,
  });
  var hq = {
    "id": "2",
    "name": "Kaserne",
    "positionX": offX,
    "positionY": offY,
    "baseHp": 100,
    "currentHp": 100,
    "tileX": self.mouseInfo.tileX,
    "tileY": self.mouseInfo.tileY,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "image": test,
    "canBeSelected": false,
    "damage": 0,
  }

  this.buildingArray.push(hq);
  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY + 1] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY + 1] = hq;
}

// Erster Versuch das HQ zu platzieren 
function addLabor(self) {
  console.log(self.mouseInfo.x + ' ' + self.mouseInfo.y + ' ' + self.mouseInfo.tileX + ' ' + self.mouseInfo.tileY);
  var offX = self.mouseInfo.tileX * this.tileColumnOffset / 2 + self.mouseInfo.tileY * this.tileColumnOffset / 2 + this.originX;
  var offY = self.mouseInfo.tileY * this.tileRowOffset / 2 - self.mouseInfo.tileX * this.tileRowOffset / 2 + this.originY;
  var test = self.physics.add.image(offX, offY, 'star');
  io.emit('labor', {
    x: offX,
    y: offY,
  });
  var hq = {
    "id": "3",
    "name": "Kaserne",
    "positionX": offX,
    "positionY": offY,
    "baseHp": 100,
    "currentHp": 100,
    "tileX": self.mouseInfo.tileX,
    "tileY": self.mouseInfo.tileY,
    "AnzhalTilesX": "1",
    "AnzhalTilesY": "1",
    "isSelected": false,
    "image": test,
    "canBeSelected": false,
    "damage": 0,
  }

  this.buildingArray.push(hq);

  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY + 1] = hq;
  IsometricMap.buildingMap[self.mouseInfo.tileX - 1][self.mouseInfo.tileY + 1] = hq;
}

function addWorker(self) {
  worker = self.add.image(Phaser.Math.RND.between(800, 200), Phaser.Math.RND.between(1000, 200), 'star').setInteractive();
  io.emit('workerLocation', {
    x: 760,
    y: 345,
  });
}

function addSolider(self) {
  solider = self.add.image(Phaser.Math.RND.between(800, 200), Phaser.Math.RND.between(1000, 200), 'star').setInteractive();
  io.emit('soliderLocation', {
    x: 820,
    y: 400,
  });
}

function addTank(self) {
  solider = self.add.image(Phaser.Math.RND.between(800, 200), Phaser.Math.RND.between(1000, 200), 'star').setInteractive();
  io.emit('tankLocation', {
    x: 1000,
    y: 600,
  });
}


// Gleiche wie in Engine
function isPlacingAllowed(self) {

  if (self.mouseInfo.tileX >= 0 && self.mouseInfo.tileY >= 0 && self.mouseInfo.tileX < IsometricMap.buildingMap.length && self.mouseInfo.tileY <= IsometricMap.buildingMap.length) {
    if ((IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY].id == 1 ||
        IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY].id == 2 ||
        IsometricMap.buildingMap[self.mouseInfo.tileX][self.mouseInfo.tileY].id == 3 ||
        IsometricMap.map[self.mouseInfo.tileX][self.mouseInfo.tileY] === 2)) {
      onRestrictedTile = true;
      io.emit('checkTileStatus', onRestrictedTile);
    } else {
      io.emit('checkTileStatus', onRestrictedTile);
      onRestrictedTile = false
    }
  }
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
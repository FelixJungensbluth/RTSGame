var worker = "worker";
var unitsArray1 = new Array();
var selectedArray = new Array();
var unitsToMove = new Array();
var pathToUse = new Array();
var id = 0;
var globalUnits = new Array;
var onlyOnce = true;
var unitsOnResource = 0;
var vectorArray = new Array();
var resourcePathArray = new Array();
var unitsOnResourceArray = new Array();
var unitsOnResourceArray2 = new Array();
var stopUnit = 0;
var c = 0;
var attackPath = new Array();
var attackPath2 = new Array();
var attackerUnits = new Array();
var attackerUnits2 = new Array();
var dmg = 0;
var rangeGraphics;
var win = false;
var lose = false;
var rangeOne = true;
var removeDamage = false;
var workerAttack = new Array();
var attackedUnits = new Array();
var woAtt = false;
var dx;
var dy;
var directons = new Array();
var direction;
var moveToPos;
var pathNotFound = false;


/*
Units werden Clientseitig ausgewählt
*/

function selectUnits(scene) {
    scene.input.on('gameobjectdown', function (pointer, gameObject) {
        gameObject.setData({
            isSelected: true
        });
        if (gameObject.getData('isSelected') && (gameObject.getData('name') == 'solider' ||
            gameObject.getData('name') == 'worker' ||
            gameObject.getData('name') == 'tank')) {

            gameObject.setTint(0xFFFFFF, 0.05);
            selectedArray.push(gameObject);

            scene.socket.emit('selctedUnitID', gameObject.getData('id'));
        }
    }, scene);
}

/*
Alle ausgewählten Units werden anhand der ID festgelegt
*/

function handelSelectedUnits(scene) {
    scene.socket.on('break', function (id) {
        unitsArray1.forEach(unit => {
            id.forEach(ids => {
                if (unit.getData('id') == ids) {
                    globalUnits.push(unit);
                }
            });
        });
    });
}

/*
Pathfinding
*/
function handleUnitMovment(scene) {
    scene.input.on('pointerdown', function (pointer) {

        if (pointer.leftButtonDown()) {
            if (unitsArray1.length != 0) {
                unitsArray1.forEach(unit => {
                    if (unit.getData('isSelected')) {
                        unit.setData({
                            isSelected: false,
                            canMove: true,
                        });
                        unit.clearTint();

                        var toX = lastClicked[0].tilePositionX;
                        var toY = lastClicked[0].tilePositionY;

                        var fromX = unit.getData('tileX');
                        var fromY = unit.getData('tileY');

                        easystar.findPath(fromX, fromY, toX, toY, function (path) {
                            if (path === null) {
                                console.warn("Path was not found.");
                                pathNotFound = true;
                            } else {
                                pathToUse.push(path);
                                scene.socket.emit('MOVE', path);
                                unit.setData({
                                    fromX: fromX,
                                    fromY: fromY,
                                    toX: toX,
                                    toY: toY,
                                    tileX: toX,
                                    tileY: toY,

                                });

                                unit.setData({
                                    tileX: path[path.length - 1].x,
                                    tileY: path[path.length - 1].y,
                                });
                            }
                        });

                        easystar.calculate();

                    }
                });
            }
        }

    }, this);
}

/*
Änderung der Richtung der Units bei der Bewegung 
*/
function getDirection(path, i, unit) {

    if (i == 0) {
        dx = unit.getData("tileX") - path[i].x;
        dy = unit.getData("tileY") - path[i].y;
    } else {
        dx = path[i].x - path[i - 1].x;
        dy = path[i].y - path[i - 1].y;
    }

    const leftDown = dx < 0
    const rightDown = dx > 0
    const upDown = dy < 0
    const downDown = dy > 0

    if (leftDown) {
        direction = "l";
    } else if (rightDown) {
        direction = "r";
    } else if (upDown) {
        direction = "u";
    } else if (downDown) {
        direction = "o";
    }

    if (direction == "l") {
        if (unit.getData("name") == "worker") {
            unit.setTexture('workerL');
        } else if (unit.getData("name") == "solider") {
            unit.setTexture('soliderL');
        } else if (unit.getData("name") == "tank") {
            unit.setTexture('tankL');
        }

    } else if (direction == "r") {
        if (unit.getData("name") == "worker") {
            unit.setTexture('workerR');
        } else if (unit.getData("name") == "solider") {
            unit.setTexture('soliderR');

        } else if (unit.getData("name") == "tank") {
            unit.setTexture('tankR');
        }

    } else if (direction == "o") {
        if (unit.getData("name") == "worker") {
            unit.setTexture('workerU');
        } else if (unit.getData("name") == "solider") {
            unit.setTexture('solider');

        } else if (unit.getData("name") == "tank") {
            unit.setTexture('tankU');
        }

    } else if (direction == "u") {
        if (unit.getData("name") == "worker") {
            unit.setTexture('workerO');
        } else if (unit.getData("name") == "solider") {
            unit.setTexture('soliderN');
        } else if (unit.getData("name") == "tank") {
            unit.setTexture('tankO');
        }
    }
    if (unit.getData("team") != finalTeam) {

        unit.setTint(0x0070FF);
    }
}

/*
Bewegung der Units 
*/
function move() {
    scene.socket.on('unitsMove', function (paths) {
        if (attackPath2.length != 0) {
            pathNotFound = false;
        }

        for (var i = 0; i < globalUnits.length; i++) {

            if (attackPath2.length == 0) {
                var endPos = {
                    x: isometricTo2d(paths[i][paths[i].length - 1].x, paths[i][paths[i].length - 1].y).x,
                    y: isometricTo2d(paths[i][paths[i].length - 1].x, paths[i][paths[i].length - 1].y).y,
                }
            } else {
                var endPos = {
                    x: 0,
                    y: 0,
                };
            }

            if (!resourcePosX.includes(endPos.x)) {
                if (globalUnits[i].getData("name") == 'solider' || globalUnits[i].getData("name") == 'tank') {
                    if (attackPath2.length == 0) {
                        moveCharacter(paths[i], scene, globalUnits[i]);
                        attackerUnits.length = 0;
                        attackPath.length = 0;
                        globalDamage.splice(globalDamage.length - 1, 1);
                        damagePositon.splice(globalDamage.length - 1, 1);
                        removeDamage = true;
                    }
                } else {
                    if (workerAttack.length == 0) {
                        moveCharacter(paths[i], scene, globalUnits[i]);
                    }
                }
                workerAttack.length = 0;
            } else {
                if (globalUnits[i].getData("name") == 'worker') {
                    moveCharacterOnResource(endPos, scene, globalUnits[i]);
                }
                if (IsometricMap.map[globalUnits[i].getData("tileX")][globalUnits[i].getData("tileY")].id == 6 && globalUnits[i].getData("name") == 'worker') {
                    collect(globalUnits[i]);
                }
            }

            pathToUse.length = 0;
            selectedArray.length = 0;
            globalUnits.length = 0;
            attackPath2.length = 0;
            directons.length = 0;
        }
    });
}

/*
Sammeln der Resourcen 
*/
function collect(unit) {
    unitsOnResourceArray2.push(unit);
}

/*
Angriff wird initialisiert 
*/
function initAttack() {
    scene.input.keyboard.on('keydown_CTRL', function (event) {
        woAtt = true
    }, this);

    scene.input.keyboard.on('keyup_CTRL', function (event) {
        woAtt = false
    }, this);

    scene.input.on('gameobjectdown', function (pointer, gameObject) {
        if (woAtt) {
            if (gameObject.getData("name") == "worker" || gameObject.getData("name") == "solider" || gameObject.getData("name") == "tank") {
                workerAttack.push(gameObject);
            }
        }
    }, scene);
}

/*
Angriff wird ausgeführt 
*/

function attack() {
    scene.input.on('pointerdown', function (pointer) {
        selectedArray.forEach(unit => {
            if (IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 5 
                && IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 0 
                || workerAttack.length != 0) {
                var start = {
                    x: unit.x,
                    y: unit.y,
                }
                var end = isometricTo2d(selectedTileX, selectedTileY);

                var pathObject = {
                    start: start,
                    end: end,
                    id: unit.getData("id"),
                }

                scene.socket.emit('attack', pathObject);
                attackerUnits.push(unit.getData("id"));
                dmg++;
                IsometricMap.buildingMapAll[selectedTileX][selectedTileY].damage += 10;
                var lenght = lineDistance(start.x, start.y, end.x, end.y);

                if (lenght <= 200) {
                    destroyBuilding(selectedTileX, selectedTileY, scene);
                    workerAttack.forEach(test => {
                        if (end.x == test.x) {
                            scene.socket.emit('unitsAttacked', test.getData("id"));
                        }
                    });
                }
            }
        });
    }, this);
}

/*
Auswahl der Units welche angreifen
*/
function unitAttack(scene) {
    scene.socket.on('attackedUnits', function (down) {
        unitsArray1.forEach(unit => {
            down.forEach(ids => {
                if (unit.getData('id') == ids) {
                    attackedUnits.push(unit);
                }
            });
        });
        attackedUnits.forEach(element => {});
    });
}

/*
Schaden an andere Units 
*/
function doDamageUnits() {
    if (attackedUnits.length != 0) {
        attackedUnits.forEach(unit => {
            unit.setData({
                currentHp: unit.getData('currentHp') - 5 +damageUp
            });
            if (unit.getData('currentHp') <= 0) {
                unit.destroy();
            }
        });
    }
}

/*
Angriff wird dargestellt 
*/
function displayAttack() {
    graphics.clear();
    graphics.setDepth(7000);
    removeDamage = false;
    if (attackPath.length != 0) {
        for (var b = 0; b < attackPath.length; b++) {
            if (attackPath[b].distance <= 200) {
                graphics.lineStyle(5, 0x8B008B, 1);
            } else {
                graphics.lineStyle(5, 0xD35400, 1);
            }
            attackPath[b].path.draw(graphics);
        }
    }
}

/*
Bewegung der Units
*/

function moveCharacter(path, scene, unit) {
    var tweens = [];

    for (var i = 0; i < path.length - 1; i++) {

        var offX = path[i + 1].x * this.tileColumnOffset / 2 + path[i + 1].y * this.tileColumnOffset / 2 + this.originX;
        var offY = path[i + 1].y * this.tileRowOffset / 2 - path[i + 1].x * this.tileRowOffset / 2 + this.originY;

        tweens.push({
            targets: unit,
            x: {
                value: offX,
                duration: 200
            },
            y: {
                value: offY,
                duration: 200
            },
            onStart: function () {

                c++;
                getDirection(path, c, unit);
            },
            onComplete: function (

            ) {
                c = 0
            },
        });
    }
    scene.tweens.timeline({
        tweens: tweens
    });
}

function updateUnits(unit) {
    var toUpdatePositon = {
        x: unit.getData("tileX"),
        y: unit.getData("tileY"),
    }
    scene.socket.emit('updatePosResource', toUpdatePositon);
}

/*
Bewegung der Unis zwischen Resourcen und HQ
*/

function moveCharacterOnResource(path, scene, unit) {
    unitsOnResourceArray.push(unit);
    var follower1 = {
        t: 0,
        vec: new Phaser.Math.Vector2()
    };

    var path1 = scene.add.path();
    var rePA = {
        path: path1,
        counter: 0,
    }
    resourcePathArray.push(rePA);

    if (unit.getData("team") == finalTeam) {
        moveToPos = updatedHqArray[finalTeam - 1];
    } else {
        if (finalTeam == 1) {
            moveToPos = updatedHqArray[1];
        } else {
            moveToPos = updatedHqArray[0];
        }
    }

    var line1 = new Phaser.Curves.Line([path.x, path.y, moveToPos.x, moveToPos.y]);
    path1.add(line1);

    scene.tweens.add({
        targets: follower1,
        t: 1,
        ease: 'Linear',
        duration: 4000,
        yoyo: true,
        repeat: -1
    });
    vectorArray.push(follower1);
}

/*
Bewegung der Unis zwischen Resourcen und HQ
*/
function moveOnResource() {
    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillStyle(0xff0000, 1);
    graphics.setDepth(7000);
    for (var b = 0; b < resourcePathArray.length; b++) {
        if (unitsOnResourceArray.length != 0) {

            resourcePathArray[b].path.draw(graphics);
            graphics.fillRect(vectorArray[b].vec.x - 5, vectorArray[b].vec.y - 5, 10, 10);
            unitsOnResourceArray[b].x = vectorArray[b].vec.x;
            unitsOnResourceArray[b].y = vectorArray[b].vec.y;
            resourcePathArray[b].path.getPoint(vectorArray[b].t, vectorArray[b].vec);
        }
        if (vectorArray[b].vec.x == updatedHqPos.x) {
            resourcePathArray[b].counter++;
        }
        if (resourcePathArray[b].counter == 3) { // TODO
            if (unitsOnResource >= 0) {

                if (unitsOnResource < 0) {
                    unitsOnResource = 0;
                }
            }
            unitsOnResourceArray[b].destroy();
            unitsOnResourceArray.splice(b, 1);
            unitsOnResourceArray2.splice(b, 1);
            resourcePathArray.splice(b, 1);
            vectorArray.splice(b, 1);
            stopUnit = 0;
        }
    }
}

/*
Resourcencounter wird geupdated 
*/
function collectResources() {
    if (selectedArray.length != 0) {

        scene.input.on('pointerdown', function (pointer) {
            if (onlyOnce) {
                unitsOnResource++;

                onlyOnce = false;
            }
        }, this);
        onlyOnce = true;
    }
}

/*
Länge der Linien werden berechnet 
*/
function lineDistance(x1, y1, x2, y2) {
    var length = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);

    return length;
}

/*
Angriff 
*/

function initAttackPath() {
    scene.socket.on('attackBreak', function (down) {
        down.forEach(line => {
            var path1 = scene.add.path();

            var line1 = new Phaser.Curves.Line([line.start.x, line.start.y, line.end.x, line.end.y]);
            path1.add(line1);

            var distance = lineDistance(line1.p0.x, line1.p0.y, line1.p1.x, line1.p1.y);

            var pathObject = {
                path: path1,
                distance: distance,
                line: line1,
                id: line.id
            }
            attackPath.push(pathObject);
            attackPath2.push(pathObject);
        });

    });
}

/*
Attackrange wird angezeigt 
*/
function showAttackRange() {
    scene.input.keyboard.on('keydown_X', function (event) {
        if (showRange) {
            selectedArray.forEach(unit => {
                if (rangeOne) {
                    rangeGraphics = scene.add.graphics();
                    rangeGraphics.fillStyle(0xFFFFFF, 0.5);
                    rangeGraphics.beginPath();

                    var p1 = {
                        x: isometricTo2d(unit.getData("tileX") + 2, unit.getData("tileY") + 2).x,
                        y: isometricTo2d(unit.getData("tileX") + 2, unit.getData("tileY") + 2).y,
                    };
                    var p2 = {
                        x: isometricTo2d(unit.getData("tileX") - 2, unit.getData("tileY") + 2).x,
                        y: isometricTo2d(unit.getData("tileX") - 2, unit.getData("tileY") + 2).y,
                    };
                    var p3 = {
                        x: isometricTo2d(unit.getData("tileX") - 2, unit.getData("tileY") - 2).x,
                        y: isometricTo2d(unit.getData("tileX") - 2, unit.getData("tileY") - 2).y,
                    };
                    var p4 = {
                        x: isometricTo2d(unit.getData("tileX") + 2, unit.getData("tileY") - 2).x,
                        y: isometricTo2d(unit.getData("tileX") + 2, unit.getData("tileY") - 2).y,
                    };

                    rangeGraphics.moveTo(0 + p1.x, 0 + p1.y);
                    rangeGraphics.lineTo(0 + p2.x, 0 + p2.y);
                    rangeGraphics.lineTo(0 + p3.x, 0 + p3.y);
                    rangeGraphics.lineTo(0 + p4.x, 0 + p4.y);
                    rangeGraphics.fillPath();
                    rangeGraphics.setDepth(7000);
                    rangeOne = false;
                }
            });
        }
    }, this);

    scene.input.keyboard.on('keyup_X', function (event) {
        if (rangeGraphics) {
            rangeGraphics.destroy();
            rangeOne = true;
        }
    }, this);
}
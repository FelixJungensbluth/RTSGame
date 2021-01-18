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

var test = new Array();

var stopUnit = 0;

function selectUnits(scene) { 
    scene.input.on('gameobjectdown', function (pointer, gameObject) {
        gameObject.setData({
            isSelected: true
        });
        console.log(gameObject);
        if (gameObject.getData('isSelected') && (gameObject.getData('name') == 'solider' || gameObject.getData('name') == 'worker')) {
            gameObject.setTint(0xFFFFFF, 0.05);
            selectedArray.push(gameObject);

            scene.socket.emit('selctedUnitID', gameObject.getData('id'));
        }
        // console.log(gameObject.getData('isSelected'));
    }, scene);
}

function handelSelectedUnits(scene) {
    scene.socket.on('break', function (id) {
        unitsArray1.forEach(unit => {
            id.forEach(ids => {
                if (unit.getData('id') == ids) { //  TODO
                    globalUnits.push(unit);
                }
            });
        });
    });
}

function handleUnitMovment(scene) {
    scene.input.on('pointerdown', function (pointer) {

        if (pointer.leftButtonDown()) {
            if (selectedArray.length != 0) {
                selectedArray.forEach(unit => {
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

                        unit.setData({
                            fromX: fromX,
                            fromY: fromY,
                            toX: toX,
                            toY: toY,
                            tileX: toX,
                            tileY: toY,

                        });

                        if (IsometricMap.map[unit.getData("tileX")][unit.getData("tileY")].id !== 50) {
                            console.log("Keine Resourcen");

                            easystar.findPath(fromX, fromY, toX, toY, function (path) {
                                if (path === null) {
                                    console.warn("Path was not found.");
                                } else {
                                    pathToUse.push(path);
                                    unitsSelected();

                                    unit.setData({
                                        tileX: path[path.length - 1].x,
                                        tileY: path[path.length - 1].y,
                                    });
                                }
                            });

                            easystar.calculate();
                        } else {
                            updateUnits(unit);
                            console.log("Resourcen");
                            var fromX = 1;
                            var fromY = 1;
                            var toX = unit.getData("tileX");
                            var toY = unit.getData("tileY");

                            unit.setData({
                                fromX: fromX,
                                fromY: fromY,
                                toX: toX,
                                toY: toY,
                            });

                            easystar.findPath(fromX, fromY, toX, toY, function (path) {
                                if (path === null) {
                                    console.warn("Path was not found.");
                                } else {
                                    pathToUse.push(path);
                                    unitsSelected();

                                    unit.setData({
                                        tileX: path[path.length - 1].x,
                                        tileY: path[path.length - 1].y,
                                    });
                                }
                            });

                            easystar.calculate();
                        }
                    }
                });
            }
        }

    }, this);
}

function unitsSelected() {
    var info = {
        path: pathToUse,
        units: selectedArray,
    }
    scene.socket.emit('MOVE', info);
}

function moveTest() {
    scene.socket.on('resourcePos', function (pos) {
        test.push(pos[pos.length - 1]);
        for (var i = 0; i < globalUnits.length; i++) {
            globalUnits[i].setData({
                tileX: test[test.length - 1].x,
                tileY: test[test.length - 1].y,
            });
        }
        test.length = 0;
        console.log(test.length);
    });

    scene.socket.on('FUCKINFO', function (cringe) {
        for (var i = 0; i < globalUnits.length; i++) {
            if (IsometricMap.map[globalUnits[i].getData("tileX")][globalUnits[i].getData("tileY")].id !== 50) {
                moveCharacter(cringe[cringe.length - 1].path[i], scene, globalUnits[i]);
            } else {

                moveCharacter(cringe[cringe.length - 1].path[i], scene, globalUnits[i]);
                moveCharacterTest(cringe[cringe.length - 1].path[i], scene, globalUnits[i]);
            }
        }
        pathToUse.length = 0;
        selectedArray.length = 0;
        globalUnits.length = 0;
    });
}

function moveCharacter(path, scene, unit) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
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
            }
        });
    }

    scene.tweens.timeline({
        tweens: tweens
    });
}

function updateUnits(unit) {
    console.log("UPDATE");
    var toUpdatePositon = {
        x: unit.getData("tileX"),
        y: unit.getData("tileY"),
    }
    scene.socket.emit('updatePosResource', toUpdatePositon);
}

function moveCharacterTest(path, scene, unit) {
    unitsOnResourceArray.push(unit);

    var follower1 = {
        t: 0,
        vec: new Phaser.Math.Vector2()
    };

    var path1 = scene.add.path();
    resourcePathArray.push(path1);

    var Xi = unit.getData('tileX');
    var Yi = unit.getData('tileY');
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

    var line1 = new Phaser.Curves.Line([offX, offY, updatedHqPos.x, updatedHqPos.y]);

    console.log(hqPosition.x + " " + updatedHqPos.x)

    //var line1 = new Phaser.Curves.Line([500,500, 1000, 1000]);
    path1.add(line1);

    scene.tweens.add({
        targets: follower1,
        t: 1,
        ease: 'Linear',
        duration: 4000,
        yoyo: true,
        repeat: 2
    });

    vectorArray.push(follower1);
    console.log(hqPosition);
}

function moveOnResource() {
    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.fillStyle(0xff0000, 1);
    graphics.setDepth(1);
    for (var b = 0; b < resourcePathArray.length; b++) {
        resourcePathArray[b].draw(graphics);
        graphics.fillRect(vectorArray[b].vec.x - 5, vectorArray[b].vec.y - 5, 10, 10);
        unitsOnResourceArray[b].x = vectorArray[b].vec.x;
        unitsOnResourceArray[b].y = vectorArray[b].vec.y;
        resourcePathArray[b].getPoint(vectorArray[b].t, vectorArray[b].vec);

        if (vectorArray[b].vec.x == updatedHqPos.x) {
            stopUnit++;
            console.log("touched");
        }
        if (stopUnit == 3) { // TODO
            resourceCounter--;
            unitsOnResourceArray[b].destroy();
            stopUnit = 0;
        }
    }
}

// Worker nur eine bestimmte Anzahl zwischen HQ und Resource hinunterher gehen lassen 
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
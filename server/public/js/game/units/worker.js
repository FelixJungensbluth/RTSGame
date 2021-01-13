var worker = "worker";
var unitsArray1 = new Array();

var selectedArray = new Array();
var unitsToMove = new Array();
var pathToUse = new Array();

var id = 0;

var globalUnits = new Array;


var onlyOnce = true;

var unitsOnResource = 0;

function initWorker() {
    worker.setData({
        name: 'worker',
        id: id,
        x: workerX,
        y: workerY,
        hp: 50,
        timeToBuild: 40,
        isSelected: true,
        canBeSelected: true,
        image: worker,
        on: true,
        tileX: 0,
        tileY: 0,
        canMove: true,
        team: teamname,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(worker);
}

function addWorker(scene) {
    scene.socket.on('workerLocation', function (workerLocation) {
        id++;
        workerX = workerLocation.x;
        workerY = workerLocation.y;
        worker = scene.add.image(workerLocation.x, workerLocation.y, 'worker').setInteractive();
        initWorker();
    });

    scene.input.on('gameobjectdown', function (pointer, gameObject) {
        gameObject.setData({
            isSelected: true
        });
        if (gameObject.getData('isSelected') && gameObject.getData('name') == 'worker') {
            gameObject.setTint(0xFFFFFF, 0.05);
            selectedArray.push(gameObject);

            scene.socket.emit('selctedUnitID', gameObject.getData('id'));
            console.log(gameObject.getData('id'));
        }
        // console.log(gameObject.getData('isSelected'));
    }, scene);
}

function handelSelectedUnits(scene) {
    scene.socket.on('break', function (id) {
        console.log(id);
        unitsArray1.forEach(unit => {
            id.forEach(ids => {
                if (unit.getData('id') == ids) { //  TODO
                    globalUnits.push(unit);
                    console.log(globalUnits);
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

                        if (IsometricMap.map[unit.getData('tileX')][unit.getData('tileY')].id !== 50) {
                            var toX = lastClicked[0].tilePositionX;
                            var toY = lastClicked[0].tilePositionY;
                            var fromX = unit.getData('tileX');
                            var fromY = unit.getData('tileY');

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

                                    //moveCharacter(path, scene, unit);
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
    scene.socket.on('FUCKINFO', function (cringe) {

        for (var i = 0; i < globalUnits.length; i++) {
            if (IsometricMap.map[globalUnits[i].getData('tileX')][globalUnits[i].getData('tileY')].id !== 50) {
            moveCharacter(cringe[cringe.length - 1].path[i], scene, globalUnits[i]);
            }
        }

        console.log(cringe[cringe.length - 1].units);
        console.log(cringe[cringe.length - 1].path);
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


function collectResources(){ 

    if(selectedArray.length != 0) { 
      
        scene.input.on('pointerdown', function (pointer) {
            if (onlyOnce) {
                unitsOnResource++;
                console.log(unitsOnResource);
                  onlyOnce = false;
                }
        }, this);
        onlyOnce = true;
    }

}
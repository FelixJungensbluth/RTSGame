var worker = "worker";
var onResource = 0;
var positonArray = new Array();

var selectedArray = new Array();
var tmp = new Array();
var tmp2 = new Array();

function drawWorker() {
    worker.setData({
        name: 'worker',
        x: workerX,
        y: workerY,
        id: 'Link',
        hp: 50,
        timeToBuild: 40,
        isSelected: false,
        image: worker,
        on: false,
        tileX: 0,
        tileY: 0,
        canMove: false,
        team: teamname,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,

    });

    unitsArray1.push(worker);
    scene.socket.on('updateArray', function (workerArray) {
        testArray2 = workerArray;
    });
}

function addWorker(scene) {
    scene.socket.on('workerLocation', function (workerLocation) {
        workerX = workerLocation.x;
        workerY = workerLocation.y;

        if (teamname === 1) {
            workerX = workerLocation.x; 
            workerY = workerLocation.y;
            worker = scene.add.image(workerLocation.x, workerLocation.y, 'worker').setInteractive();
            drawWorker();

        } else {
            workerX = workerLocation.x;
            workerY = workerLocation.y;
            worker = scene.add.image(workerLocation.x, workerLocation.y, 'unit1').setInteractive();
            drawWorker();

        }

        scene.input.on('gameobjectdown', function (pointer, gameObject) {
            gameObject.setData({
                isSelected: true,
            });
            if (gameObject.getData('isSelected') && gameObject.getData('name') == 'worker') {
                gameObject.setTint(0xFFFFFF, 0.05);
            }
            // console.log(gameObject.getData('isSelected'));
        }, scene);
    });
}

function handelSelectedUnits(scene) {
    scene.input.on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown()) {
            if (unitsArray1.length != 0) {
                unitsArray1.forEach(unit => {
                    if (unit.getData('isSelected')) {
                            tmp.push(unit);
                           
                    }
                });
                var dataArr = tmp.map(item=>{
                    return [JSON.stringify(item),item]
                }); // creates array of array
                var maparr = new Map(dataArr); // create key value pair from array of array
                
               selectedArray = [...maparr.values()];//converting back to array from mapobject
                
               selectedArray.forEach(test => {
                   var testObj = {
                        fromX: test.getData('fromX'),
                        fromY: test.getData('fromY'),
                        toX: test.getData('toX'),
                        toY: test.getData('toY'),
                   }

                   tmp2.push(testObj);
                
               });
                console.log(tmp2);
            }
        }
    }, this);
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
                                fromX:fromX,
                                fromY:fromY,
                                toX:toX,
                                toY:toY,
                            });

                            console.log(unit);
                            scene.socket.emit('unitInfo', tmp2);

                            scene.socket.on('pathFinding', function (cords) {
                                console.log(cords.x)
                               moveCharacterTest(cords.x, cords.y, cords.path, unit);
                            });


                            /*
                            console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

                            easystar.findPath(fromX, fromY, toX, toY, function (path) {
                                if (path === null) {
                                    console.warn("Path was not found.");
                                } else {
                                    console.log(path);
                                    scene.socket.emit('pathInfo', path);
                                    moveCharacter(path, scene, unit);

                                    unit.setData({
                                        tileX: path[path.length - 1].x,
                                        tileY: path[path.length - 1].y,
                                    });
                                }
                            });

                            easystar.calculate();
                            */

                        } else {
                            scene.tweens.add({
                                targets: follower,
                                t: 1,
                                ease: 'Linear',
                                duration: 2000,
                                yoyo: true,
                                repeat: -1
                            });

                            var line1 = new Phaser.Curves.Line([
                                buildingArray[0].positionX,
                                buildingArray[0].positionY,
                                IsometricMap.map[unit.getData('tileX')][unit.getData('tileY')].positionX,
                                IsometricMap.map[unit.getData('tileX')][unit.getData('tileY')].positionY,
                            ]);
                            path.add(line1);
                        }

                    }
                });
            }
            collectResources(scene);
        }

    }, this);
}

function collectResources(scene) {
    if (unitsArray1.length != 0) {
        unitsArray1.forEach(unit => {
            if (IsometricMap.map[unit.getData('tileX')][unit.getData('tileY')].id === 50) {
                unit.setData({
                    on: "resource",
                });
                onResource += 1
            } else if (IsometricMap.map[unit.getData('tileX')][unit.getData('tileY')].id !== 50 && unit.getData("on")) {
                console.log("sdfsdfsdffsd");
                if (onResource > 0) {
                    onResource -= 1
                }

            }
        });
    }

    console.log(onResource);
}

function moveCharacter(path, scene, unit) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for (var i = 0; i < path.length - 1; i++) {
        var offX = path[i + 1].x * this.tileColumnOffset / 2 + path[i + 1].y * this.tileColumnOffset / 2 + this.originX;
        var offY = path[i + 1].y * this.tileRowOffset / 2 - path[i + 1].x * this.tileRowOffset / 2 + this.originY;
        //console.log(offX);

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

};


function moveCharacterTest(offX, offY, path, unit) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for (var i = 0; i < path.length - 1; i++) {
       
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

};

function updatePosition(positionCount, distance, path) {
    var offX = path[path.length - 1].x * this.tileColumnOffset / 2 + path[path.length - 1].y * this.tileColumnOffset / 2 + this.originX;

    for (var i = 0; i < positionCount; i++) {
        var angle = i * (360 / positionCount);
        var x = offX + angle * distance;
        //var y = start + angle * distance;
        positonArray.push(x);
    }

}
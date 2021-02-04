var onRestrictedTile = false;
var selectionRectangle;

var testSelect = false; // Auswahlrechteck


// Gebaeude werden durch linksklick platziert
function placeBuilding(szene) {
    szene.input.on('pointerdown', function (pointer) {
        if (!onRestrictedTile) {
            if (pointer.leftButtonDown()) {

                //HQ
                if (!isSelected && pressed == "s") {
                    pressed = "none"
                    drawHq(selectedTileX, selectedTileY);
                    buildingTime(szene);
                    selectedStructure.destroy();
                }

                // Kaserne 
                if (!isSelected && pressed == "d" && IsometricMap.buildingMap[hqPositionTest.tileX][hqPositionTest.tileY].isSelected) {
                    pressed = "none"
                    drawBarracks(selectedTileX, selectedTileY, szene);
                    buildingTime(szene);
                    selectedStructure.destroy();

                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].image.clearTint();
                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].isSelected = false;
                }

                // Labor 
                if (!isSelected && pressed == "e" && IsometricMap.buildingMap[hqPositionTest.tileX][hqPositionTest.tileY].isSelected) {
                    pressed = "none"
                    drawLabor(selectedTileX, selectedTileY, szene);
                    buildingTime(szene);
                    selectedStructure.destroy();

                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].image.clearTint();
                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].isSelected = false;
                }

                // Fatory
                if (!isSelected && pressed == "f" && IsometricMap.buildingMap[hqPositionTest.tileX][hqPositionTest.tileY].isSelected) {
                    pressed = "none"
                    drawFac(selectedTileX, selectedTileY, szene);
                    buildingTime(szene);
                    selectedStructure.destroy();

                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].image.clearTint();
                    IsometricMap.buildingMap[hqPosition.tileX][hqPosition.tileY].isSelected = false;
                }
            }

            // Auswahl wird entfernt 
            if (IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected || IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].barracksIsSelected ||   IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].laborIsSelected || IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].fabricIsSelected) {
                console.log("DESELECTED");
                IsometricMap.buildingMap[selectedTileX][selectedTileY].image.clearTint();
                IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected = false;
             //   szene.socket.emit('structureSelected', IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected);

                if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 1) {
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY].isSelected = false;

                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 1].isSelected = false;

                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 2].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 2].isSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 2].isSelected = false;

                    szene.socket.emit('structureSelected', IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected);
                    
                }

                if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 2) {
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].barracksIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].barracksIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].barracksIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].barracksIsSelected = false;
                    console.log("sdfsdfsdfdfs");
                    szene.socket.emit('structureSelectedKaserne', IsometricMap.buildingMap[selectedTileX][selectedTileY].barracksIsSelected);
                    
                }

                if ( IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 3) {
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].laborIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].laborIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].laborIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].laborIsSelected = false;
                    szene.socket.emit('structureSelectedLabor', IsometricMap.buildingMap[selectedTileX][selectedTileY].laborIsSelected);
                }

                if ( IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 4) {


                    IsometricMap.buildingMap[selectedTileX][selectedTileY].fabricIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].fabricIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY].fabricIsSelected = false;
    
                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].fabricIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].fabricIsSelected = false;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 1].fabricIsSelected = false;
                    szene.socket.emit('structureSelectedFabrik', IsometricMap.buildingMap[selectedTileX][selectedTileY].fabricIsSelected);
                }
            }
        }

        if (pointer.rightButtonDown()) {
            // Auswahl wird hinzugefuegt.
            console.log(IsometricMap.buildingMap[selectedTileX][selectedTileY]);
            if (IsometricMap.buildingMap[selectedTileX][selectedTileY].canBeSelected) {

              
                IsometricMap.buildingMap[selectedTileX][selectedTileY].image.setTint(0xFFFFFF, 0.05);

                if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 1) {
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY].isSelected = true;

                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 1].isSelected = true;

                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 2].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 2].isSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 2].isSelected = true;

                    szene.socket.emit('structureSelected', IsometricMap.buildingMap[selectedTileX][selectedTileY].isSelected);
                    
                }

                if (IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 2) {
                   
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].barracksIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].barracksIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].barracksIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].barracksIsSelected = true;
                    szene.socket.emit('structureSelectedKaserne', IsometricMap.buildingMap[selectedTileX][selectedTileY].barracksIsSelected);
                }

                if ( IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 3) {
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].laborIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].laborIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].laborIsSelected = true;
                    IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].laborIsSelected = true;
                    szene.socket.emit('structureSelectedLabor', IsometricMap.buildingMap[selectedTileX][selectedTileY].laborIsSelected);
                }
            }

            if ( IsometricMap.buildingMap[selectedTileX][selectedTileY].id == 4) {


                IsometricMap.buildingMap[selectedTileX][selectedTileY].fabricIsSelected = true;
                IsometricMap.buildingMap[selectedTileX - 1][selectedTileY].fabricIsSelected = true;
                IsometricMap.buildingMap[selectedTileX - 2][selectedTileY].fabricIsSelected = true;

                IsometricMap.buildingMap[selectedTileX][selectedTileY + 1].fabricIsSelected = true;
                IsometricMap.buildingMap[selectedTileX - 1][selectedTileY + 1].fabricIsSelected = true;
                IsometricMap.buildingMap[selectedTileX - 2][selectedTileY + 1].fabricIsSelected = true;
                szene.socket.emit('structureSelectedFabrik', IsometricMap.buildingMap[selectedTileX][selectedTileY].fabricIsSelected);
            }
        }
    }, this);
}

// Infos zum letzten klick werden zwischengespeichert 
function getLastClicked(szene) {

    // Objekt mit Mausinfos wird erstellt 
    var lastClickInfo = {
        "button": "none",
        "tilePositionX": "0",
        "tilePositionY": "0",
        "positionX": "0",
        "positionY": "0",
    }

    // wenn Maus geklicked wird, werden Infos des Objekts geupdated   
    szene.input.on('pointerdown', function (pointer) {

        // Arrary wird geleert, sodas immer nur ein Objekt im Array ist 
        if (lastClicked.length != 0) {
            this.lastClicked.pop();
        }

        if (pointer.leftButtonDown()) {
            lastClickInfo.button = "links"
        }

        if (pointer.rightButtonDown()) {
            lastClickInfo.button = "rechts"
        }

        if (pointer.middleButtonDown()) {
            lastClickInfo.button = "mittel"
        }

        lastClickInfo.tilePositionX = selectedTileX;
        lastClickInfo.tilePositionY = selectedTileY;

        lastClickInfo.positionX = pointer.x;
        lastClickInfo.positionY = pointer.y;

        this.lastClicked.push(lastClickInfo);
    }, this);
}

// TODO Fix
function createSelectionRectangle(scene) {

    scene.input.on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown()) {
           // selectionRectangle = scene.add.rectangle(pointer.x, pointer.y, 0, 0, 0xffffff, 0.5);
        }
    }, this);

    scene.input.on('pointerup', function (pointer) {
        if (pointer.rightButtonDown()) {
            // console.log("dsfsdfsdf");
           // selectionRectangle.x = -1000;
            //selectionRectangle.destroy();
        }

    }, this);
}

// TODO Fix
function checkUnitsInSelection() {
    if (unitsArray1.length != 0) {
        unitsArray1.forEach(unit => {
            if (unit.x >= selectionRectangle.x && unit.x <= selectionRectangle.x + selectionRectangle.width) {
                unit.setTint(0xFFFFFF, 0.05);
                unit.setData({
                    isSelected: true,
                });
            }
        });
    }
}

function updateSelect(scene) {
    scene.socket.on('testSelect', function (keinBock) {
        testSelect = keinBock;
        console.log(keinBock);
    });
}
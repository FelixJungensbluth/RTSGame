var mapOverlay;
var optionsOverlay;
var timeOverlay;
var resourceOverlay;
var onlyOnce = true;
var hpText;
var hpBackground;
var settingsImg;
var showRangeButton;
var surrender;
var background;
var show = true;
var readyBackground;
var backgroundDark;
var playButton;
var ready1;
var ready2;
var countdown = false;
var secsPassed = 2;
var showRange = false;
var hpWidth = 80
var recArray = new Array();
var gameStart = false;
var overviewOnce = true;
var kaserneButton;
var laborButton;
var workerButton;
var walkerButton;
var fabrikButton;
var panzerButton;
var attackUp;
var armorUp;
var buttonArray = new Array();
var readyArray = new Array();

/*
 Alle Overlays werden in die Szene platziert 
 Map, Zeit, Materialien
*/
function displayOverlay() {
    mapOverlay = scene.add.image(180, window.innerHeight - 173, 'olMap').setScrollFactor(0);
    optionsOverlay = scene.add.image(window.innerWidth - 190, window.innerHeight - 173, 'olOptions').setScrollFactor(0);
    timeOverlay = scene.add.image(109, 17, 'olTime').setScrollFactor(0);
    resourceOverlay = scene.add.image(90, 48, 'olResource').setScrollFactor(0);

    mapOverlay.setDepth(6000);
    optionsOverlay.setDepth(6000);
    timeOverlay.setDepth(6000);
    resourceOverlay.setDepth(6000);

}

/*
 Zeigt die HP an, wenn mit der Maus uber eine Struktur gehovert wid 
*/
function hp() {

    if (IsometricMap.buildingMapAll[selectedTileX][selectedTileY] == 0) {
        if (recArray.length != 0) {
            recArray.forEach(rec => {
                rec.destroy();
            });
        }
    }

    if (selectedTileX >= 0 && selectedTileY >= 0 && selectedTileX < IsometricMap.buildingMap.length && selectedTileY < IsometricMap.buildingMap.length) {
        if (IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 5 && IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 0) {
            if (onlyOnce && IsometricMap.buildingMap[selectedTileX][selectedTileY].canBeSelected) {
                hpBackground = scene.add.rectangle(
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                    80, 5, 0xff0000
                );
                hpBackground.setDepth(4000);

                recArray.push(hpBackground);
                testRect = scene.add.rectangle(
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                    hpWidth, 5, 0x39ff14
                );
                testRect.setDepth(4000);
                recArray.push(testRect);
                onlyOnce = false;
            }
        } else {

            onlyOnce = true;
        }
    }
}

/*
Update der HP Anzeige 
Prozentualer Berechnung aussgehend von der Width der Anzeige 
*/
function updateHp() {
    if (testRect) {
        var currentHp = IsometricMap.buildingMapAll[selectedTileX][selectedTileY].currentHp;
        var base = IsometricMap.buildingMapAll[selectedTileX][selectedTileY].baseHp;

        if (currentHp >= 0) {
            var lostHp = (currentHp * 100) / base;
            testRect.width = (80 * lostHp) / 100;
        }

    }
}

/*
Wenn die ESC Taste gedreuckt werden die Einstellungen angezeigt 
*/
function settings() {
    scene.input.keyboard.on('keydown_ESC', function (event) {
        show ^= true;

        if (!show) {
            canMoveCam = false;
            background = scene.add.rectangle(0 + window.innerWidth / 2, 0 + window.innerHeight / 2, window.innerWidth, window.innerHeight, 0x0000, 0.75).setScrollFactor(0);
            background.setDepth(7000);

            settingsImg = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'settings').setScrollFactor(0);
            settingsImg.setDepth(7001);

            showRangeButton = scene.add.image(window.innerWidth / 2, (window.innerHeight / 2) - 20, 'range').setScrollFactor(0);
            showRangeButton.setInteractive();
            showRangeButton.setDepth(7001);
            showRangeButton.on('pointerdown', function (pointer) {
                showRange ^= true;
            }, this);

            surrender = scene.add.image(window.innerWidth / 2, (window.innerHeight / 2) + 40, 'surrender').setScrollFactor(0);
            surrender.setDepth(7001);
            surrender.setInteractive();
            surrender.on('pointerdown', function (pointer) {
                lose = true;
                scene.socket.emit('lose', lose);
                settingsImg.destroy();
                showRangeButton.destroy();
                surrender.destroy();
                background.destroy();
            }, this);

        } else if (show) {
            canMoveCam = true;
            settingsImg.destroy();
            showRangeButton.destroy();
            surrender.destroy();
            background.destroy();
            onlyOnceSettings = true;
        }
    }, this);
}


/*
Jeder Spieler muss bereit sein damit das Spiel beginnt 
*/
function readyUp(scene) {
    backgroundDark = scene.add.rectangle(0 + window.innerWidth / 2, 0 + window.innerHeight / 2, window.innerWidth, window.innerHeight, 0x0000, 0.9).setScrollFactor(0);
    backgroundDark.setDepth(10000);

    readyBackground = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'readyBackground').setScrollFactor(0);
    readyBackground.setDepth(10001);

    playButton = scene.add.image(window.innerWidth / 2, (window.innerHeight / 2) + 35, 'playButton').setScrollFactor(0);
    playButton.setInteractive();
    playButton.setDepth(10001);
    playButton.on('pointerdown', function (pointer) {
        scene.socket.emit("ready", "test");
    }, this);

    scene.socket.on('readyRec', function (recCount) {

        if (recCount == 1) {
            ready1 = scene.add.rectangle(-44 + window.innerWidth / 2, -19 + window.innerHeight / 2, 76, 20, 0xff0000, 1).setScrollFactor(0);
            ready1.setDepth(10002);
            readyArray.push(ready1);

        }

        if (recCount == 2) {
            ready2 = scene.add.rectangle(40 + window.innerWidth / 2, -19 + window.innerHeight / 2, 76, 20, 0xff0000, 1).setScrollFactor(0);
            ready2.setDepth(10002);
            readyArray.push(ready2);

            setTimeout(() => {
                readyBackground.destroy();
                playButton.destroy();
                readyArray.forEach(element => {
                    element.destroy();
                });
                countdown = true;
            }, 1000);

        }
    });
}


/*
Je nach ausgewählten Gebäude werden die möglichen Aktionen angezeigt 
*/
function overview() {
    hqButton = scene.add.image(window.innerWidth - 280, window.innerHeight - 226, '1b').setScrollFactor(0);
    scene.input.on('pointerdown', function (pointer) {

        if (pointer.rightButtonDown()) {
            if (overviewOnce) {

                if (hqSelected) {
                    hqButton.destroy();
                    kaserneButton = scene.add.image(window.innerWidth - 180, window.innerHeight - 226, '2b').setScrollFactor(0);
                    kaserneButton.setDepth(8000);

                    workerButton = scene.add.image(window.innerWidth - 180, window.innerHeight - 136, '5b').setScrollFactor(0);
                    workerButton.setDepth(8000);


                    laborButton = scene.add.image(window.innerWidth - 80, window.innerHeight - 226, '3b').setScrollFactor(0);
                    laborButton.setDepth(8000);

                    buttonArray.push(kaserneButton);
                    buttonArray.push(workerButton);
                    buttonArray.push(laborButton);

                    if (laborCounter > 0) {
                        fabrikButton = scene.add.image(window.innerWidth - 280, window.innerHeight - 136, '4b').setScrollFactor(0);
                        fabrikButton.setDepth(8000);
                        buttonArray.push(fabrikButton);
                    }

                    if (resourceCounter < 100) {
                        laborButton.setTint(0xFFFFFF, 0.1);
                    }

                    if (resourceCounter < 50) {
                        kaserneButton.setTint(0xFFFFFF, 0.1);
                    }

                    if (resourceCounter < 10) {
                        workerButton.setTint(0xFFFFFF, 0.1);
                    }
                }
                if (kaserneSelected) {
                    walkerButton = scene.add.image(window.innerWidth - 80, window.innerHeight - 136, '6b').setScrollFactor(0);
                    walkerButton.setDepth(8000);
                    buttonArray.push(walkerButton);
                    if (resourceCounter < 20) {
                        walkerButton.setTint(0xFFFFFF, 0.1);
                    }
                }

                if (laborSelected) {
                    armorUp = scene.add.image(window.innerWidth - 280, window.innerHeight - 46, '9b').setScrollFactor(0);
                    armorUp.setDepth(8000);

                    attackUp = scene.add.image(window.innerWidth - 180, window.innerHeight - 46, '8b').setScrollFactor(0);
                    attackUp.setDepth(8000);

                    buttonArray.push(armorUp);
                    buttonArray.push(attackUp);

                    if (resourceCounter < 200) {
                        attackUp.setTint(0xFFFFFF, 0.1);
                        armorUp.setTint(0xFFFFFF, 0.1);
                    }
                }

                if (fabrikSelected) {
                    panzerButton = scene.add.image(window.innerWidth - 80, window.innerHeight - 46, '7b').setScrollFactor(0);
                    panzerButton.setDepth(8000);
                    buttonArray.push(panzerButton);
                    if (resourceCounter < 50) {
                        panzerButton.setTint(0xFFFFFF, 0.1);
                    }

                }
            }
        }

        if (pointer.leftButtonDown()) {
            buttonArray.forEach(element => {
                element.destroy();
            });

        }

    }, this);
}


/*
Hintergrundbild
*/
function backgorundImage() {
    scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background').setScrollFactor(0);
}
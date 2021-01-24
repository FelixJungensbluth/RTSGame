var mapOverlay;
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

var showRange = false;

var hpWidth = 80

var recArray = new Array();

/*
 Alle Overlays werden in die SCene platziert 
 Map, Zeit, Materialien
*/
function displayOverlay() {
    mapOverlay = scene.add.image(200, window.innerHeight - 200, 'olMap').setScrollFactor(0);
    timeOverlay = scene.add.image(109, 17, 'olTime').setScrollFactor(0);
    resourceOverlay = scene.add.image(90, 48, 'olResource').setScrollFactor(0);
}


/*
 Zeigt die HP an, wenn mit der Maus uber eine Struktur gehovert wid 
*/
function hp() {

    if (IsometricMap.buildingMapAll[selectedTileX][selectedTileY] == 0) {
        
        if(recArray.length !=0){
            recArray.forEach(rec => {
                rec.destroy();
        });
        }
        

    }
    if ((selectedTileX >= 0 && selectedTileX < IsometricMap.buildingMap.length) && (selectedTileY >= 0 && selectedTileY < IsometricMap.buildingMap[0].length)) {
        if (IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 5 && IsometricMap.buildingMapAll[selectedTileX][selectedTileY] != 0) {
            if (onlyOnce && IsometricMap.buildingMap[selectedTileX][selectedTileY].canBeSelected) {
                hpBackground = scene.add.rectangle(
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                    80, 5, 0xff0000
                );

                recArray.push(hpBackground);

                testRect = scene.add.rectangle(
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionX,
                    IsometricMap.buildingMap[selectedTileX][selectedTileY].positionY - 40,
                    hpWidth, 5, 0x39ff14
                );
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

        if(currentHp >=0){
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

            background = scene.add.rectangle(0 + window.innerWidth / 2, 0 + window.innerHeight / 2, window.innerWidth, window.innerHeight, 0x0000, 0.75).setScrollFactor(0);
            background.setDepth(3);

            settingsImg = scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'settings').setScrollFactor(0);
            settingsImg.setDepth(4);

            showRangeButton = scene.add.image(window.innerWidth / 2, (window.innerHeight / 2) - 20, 'range').setScrollFactor(0);
            showRangeButton.setInteractive();
            showRangeButton.setDepth(4);
            showRangeButton.on('pointerdown', function (pointer) {
                showRange ^= true;
            }, this);
         
            surrender = scene.add.image(window.innerWidth / 2,(window.innerHeight / 2) + 40, 'surrender').setScrollFactor(0);
            surrender.setDepth(4);
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
            settingsImg.destroy();
            showRangeButton.destroy();
            surrender.destroy();
            background.destroy();
            onlyOnceSettings = true;
        }
    }, this);
}

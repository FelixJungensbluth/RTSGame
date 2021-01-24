var damagePositon = new Array();
var globalDamage = new Array();

var play = true;

function destroyBuilding(x, y, scene) {

    var positon = {
        xPos: x,
        yPos: y,
    }
    console.log(positon);
    damagePositon.push(positon);


    for (var i = 0; i < buildingArray.length; i++) {
        if (buildingArray[i].image == 'none') {
            buildingArray.splice(i, 1);
        }
    }

    scene.socket.emit('damagePositon', positon);
}

function doDamage(scene) {
    
    if (globalDamage.length != 0) {
        globalDamage.forEach(building => {
           
                if(!removeDamage) {
                    play = true;
                    IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp -= 10;
                    playDamage(scene , IsometricMap.buildingMapAll[building.xPos][building.yPos].positionX ,IsometricMap.buildingMapAll[building.xPos][building.yPos].positionY);
                } else {
                    play = false;
                    IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp -= 0;
                }
              


            if (IsometricMap.buildingMapAll[building.xPos][building.yPos].currentHp <= 0) {
                console.log(imageArray);
                for (var i = 0; i < imageArray.length; i++) {
                
                    console.log(imageArray[i].x + "  "  + IsometricMap.buildingMapAll[building.xPos][building.yPos].positionX);
                    
                    if (imageArray[i].x == IsometricMap.buildingMapAll[building.xPos][building.yPos].positionX && imageArray[i].y == IsometricMap.buildingMapAll[building.xPos][building.yPos].positionY) {
                        console.log(IsometricMap.buildingMapAll[building.xPos][building.yPos].team + '   ' + teamname);
                        
                        playExplosion(scene, imageArray[i].x,  imageArray[i].y);
                        imageArray[i].destroy();
                        imageArray.splice(i,1);
                        dmgSprite.destroy();
                        play = false;
                        if(IsometricMap.buildingMapAll[building.xPos][building.yPos].team != teamname && IsometricMap.buildingMapAll[building.xPos][building.yPos].name == "hq") {
                            win = true;
                          scene.socket.emit('win', win);
                      }
                    }

                    
                }
                IsometricMap.buildingMapAll[building.xPos][building.yPos] = 0;
            } 
        });
    }
}

function globalDamagePos() {
    scene.socket.on('testDmg', function (pos) {
        pos.forEach(sdfs => {
            globalDamage.push(sdfs);
        });
       
        console.log(globalDamage);
    });
}
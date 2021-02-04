var canMoveCam = false;

/*
  Bewegung der Kamera wenn der Cursor an einen Rand des Fensters kommt 
  Wenn man mit dem Mauszeiger an einen Rand kommt bewegt sich die Kamera 
  in die jeweilige Richtung 
*/

function moveCamera(szene, cam) {
    if(finalTeam != 1) {
        cam.scrollX = 400;
        camMoveX = 400;
    } else {
        cam.scrollX = -400;
        camMoveX = -400;
    }

    szene.input.on('pointermove', function (pointer) {

        var camMoveThresholdX = window.innerWidth * 0.04;
        var camMoveThresholdY= window.innerHeight * 0.04;
        
        if(canMoveCam) {

        if (pointer.y < camMoveThresholdY) {
            cam.scrollY -= 4;
            camMoveY -= 4;
        }

        if (pointer.y > window.innerHeight -camMoveThresholdY) {
            cam.scrollY += 4;
            camMoveY += 4;
        }

        if (pointer.x < camMoveThresholdX) {
            cam.scrollX -= 4;
            camMoveX -= 4;
        }

        if (pointer.x > window.innerWidth -camMoveThresholdX) {
            cam.scrollX += 4;
            camMoveX += 4;
        }
    }
    }, this);
}

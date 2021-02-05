var canMoveCam = false;

/*
  Bewegung der Kamera wenn der Cursor an einen Rand des Fensters kommt 
  Wenn man mit dem Mauszeiger an einen Rand kommt bewegt sich die Kamera 
  in die jeweilige Richtung 
*/

function setCamera(scene, cam, team) {
    console.log(team);
    if (finalTeam != 1) {
        cam.scrollX = 1400;
        camMoveX = 1400;

        cam.scrollY = 500;
        camMoveY = 500;


    } else {
        cam.scrollX = 1500;
        camMoveX = 1500;
        cam.scrollY = -800;
        camMoveY = -800;
    }
}

function moveCamera(szene, cam) {


    szene.input.on('pointermove', function (pointer) {

        var camMoveThresholdX = window.innerWidth * 0.04;
        var camMoveThresholdY = window.innerHeight * 0.04;

        if (canMoveCam) {

            if (pointer.y < camMoveThresholdY) {
                cam.scrollY -= 4;
                camMoveY -= 4;
            }

            if (pointer.y > window.innerHeight - camMoveThresholdY) {
                cam.scrollY += 4;
                camMoveY += 4;
            }

            if (pointer.x < camMoveThresholdX) {
                cam.scrollX -= 4;
                camMoveX -= 4;
            }

            if (pointer.x > window.innerWidth - camMoveThresholdX) {
                cam.scrollX += 4;
                camMoveX += 4;
            }
        }
    }, this);
}
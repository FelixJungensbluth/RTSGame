var canMoveCam = false;

/*
  Bewegung der Kamera wenn der Cursor an einen Rand des Fensters kommt 
  Wenn man mit dem Mauszeiger an einen Rand kommt bewegt sich die Kamera 
  in die jeweilige Richtung 
*/
function moveCamera(szene, cam) {

    szene.input.on('pointermove', function (pointer) {

        var camMoveThresholdX = window.innerWidth * 0.04;
        var camMoveThresholdY= window.innerHeight * 0.04;
        
        if(canMoveCam) {

        if (pointer.y < camMoveThresholdY) {
            cam.scrollY -= 10;
            camMoveY -= 10;
        }

        if (pointer.y > window.innerHeight -camMoveThresholdY) {
            cam.scrollY += 10;
            camMoveY += 10;
        }

        if (pointer.x < camMoveThresholdX) {
            cam.scrollX -= 10;
            camMoveX -= 10;
        }

        if (pointer.x > window.innerWidth -camMoveThresholdX) {
            cam.scrollX += 10;
            camMoveX += 10;
        }
    }
    }, this);
}

var canMoveCam = true;

/*
  Bewegung der Kamera wenn der Cursor an einen Rand des Fensters kommt 
  Wenn man mit dem Mauszeiger an einen Rand kommt bewegt sich die Kamera 
  in die jeweilige Richtung 
*/
function moveCamera(szene, cam) {
    szene.input.on('pointermove', function (pointer) {
        if(canMoveCam) {

        if (pointer.y < 50) {
            cam.scrollY -= 4;
            camMoveY -= 4;
        }

        if (pointer.y > 880) {
            cam.scrollY += 4;
            camMoveY += 4;
        }

        if (pointer.x < 50) {
            cam.scrollX -= 4;
            camMoveX -= 4;
        }

        if (pointer.x > 1870) {
            cam.scrollX += 4;
            camMoveX += 4;
        }
    }
    }, this);
}

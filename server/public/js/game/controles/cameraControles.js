//Bewegung der Kamera wenn der Cursor an einen Rand des Fensters kommt 
function moveCamera(szene, cam) {
    szene.input.on('pointermove', function (pointer) {
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
    }, this);
}

//Zoom mit dem Mausrad
function zoomCamera(szene, cam) {
    szene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        zoom -= deltaY * 0.0005
        cam.setZoom(zoom);

    }, this);
}
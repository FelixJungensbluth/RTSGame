var worker = "worker";

function drawWorker() {
    worker = scene.add.image(workerX, workerY, 'worker').setInteractive();
    worker.setData({
        name: 'worker',
        x: workerX,
        y: workerY,
        id: 'Link',
        hp: 50,
        timeToBuild: 40,
        isSelected: false,
    });
}

function addWorker(scene) {
    scene.socket.on('workerLocation', function (workerLocation) {
        workerX = workerLocation.x;
        workerY = workerLocation.y;

        drawWorker();
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
var worker = "worker";

function initWorker() {
    worker.setData({
        name: 'worker',
        id: id,
        x: workerX,
        y: workerY,
        hp: 50,
        timeToBuild: 40,
        isSelected: true,
        canBeSelected: true,
        image: worker,
        on: true,
        tileX: 0,
        tileY: 0,
        canMove: true,
        team: teamname,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(worker);
}

function addWorker(scene) {
    scene.socket.on('workerLocation', function (workerLocation) {
        id++;
        workerX = workerLocation.x;
        workerY = workerLocation.y;
        worker = scene.add.image(workerLocation.x, workerLocation.y, 'worker').setInteractive();
        initWorker();
    });
}

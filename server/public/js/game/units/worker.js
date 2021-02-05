var worker = "worker";

function initWorker(team) {
    worker.setData({
        name: 'worker',
        id: id,
        x: workerX,
        y: workerY,
        hp: 50,
        currentHp: 50,
        timeToBuild: 40,
        isSelected: true,
        canBeSelected: true,
        image: worker,
        on: true,
        tileX: 0,
        tileY: 0,
        canMove: true,
        team: team,
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
        initWorker(workerLocation.team);

        if(workerLocation.team == finalTeam) { 
            resourceCounter -=5;
        } else {
            worker.setTint(0x0070FF);
        }

        console.log(worker.getData("team") + "  " + workerLocation.team);

    });
}
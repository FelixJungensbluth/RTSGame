var tank = "tank";

function initTank() {
    tank.setData({
        name: 'tank',
        id: id,
        x: soliderX,
        y: soliderY,
        hp: 50,
        timeToBuild: 40,
        damage: 5,
        isSelected: true,
        canBeSelected: true,
        image: worker,
        on: true,
        tileX: 0,
        tileY: 0,
        canMove: true,
        canAttack: false,
        team: teamname,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(tank);
}

function addTank(scene) {
    scene.socket.on('tankLocation', function (tankLocation) {
        id++;
        tankX = tankLocation.x;
        tankY = tankLocation.y;
        tank = scene.add.image(tankLocation.x, tankLocation.y, 'tankU').setInteractive();
        initTank();
    });
}
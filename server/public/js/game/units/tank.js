var tank = "tank";

/*
Panzer wird initalisiert
*/
function initTank(team) {
    tank.setData({
        name: 'tank',
        id: id,
        x: soliderX,
        y: soliderY,
        hp: 200 + hpUp,
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
        team: team,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(tank);
}

/*
Panzer wird der Szene hinzugefügt
*/
function addTank(scene) {
    scene.socket.on('tankLocation', function (tankLocation) {
        id++;
        tankX = tankLocation.x;
        tankY = tankLocation.y;
        tank = scene.add.image(tankLocation.x, tankLocation.y, 'tankU').setInteractive();
        initTank(tankLocation.team);

        tank.setData({
            tileX: soliderLocation.spawnTileX,
            tileY: soliderLocation.spawnTileY,
        });


        if (tankLocation.team == finalTeam) {
            resourceCounter -= 5;
        } else {
            tank.setTint(0x0070FF);
        }
    });
}
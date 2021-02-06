var solider = "solider";

/*
Soldart wird initalisiert
*/
function initSolider(team) {
    solider.setData({
        name: 'solider',
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
        team: team,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(solider);
}

/*
Soldat wird der Szene hinzugefügt
*/
function addSolider(scene) {
    scene.socket.on('soliderLocation', function (soliderLocation) {
        id++;
        soliderX = soliderLocation.x;
        soliderY = soliderLocation.y;
        solider = scene.add.image(soliderLocation.x, soliderLocation.y, 'solider').setInteractive();
        initSolider(soliderLocation.team);
        solider.setData({
            tileX: soliderLocation.spawnTileX,
            tileY: soliderLocation.spawnTileY,
        });

        if (soliderLocation.team == finalTeam) {
            resourceCounter -= 5;
        } else {
            solider.setTint(0x0070FF);
        }
    });
}
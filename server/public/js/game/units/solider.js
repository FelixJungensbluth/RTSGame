var solider = "solider";
function initSolider() {
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
        team: teamname,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    });

    unitsArray1.push(solider);
}

function addSolider(scene) {
    scene.socket.on('soliderLocation', function (soliderLocation) {
        id++;
        soliderX = soliderLocation.x;
        soliderY = soliderLocation.y;
        solider = scene.add.image(soliderLocation.x, soliderLocation.y, 'solider').setInteractive();
        initSolider();
    });
}

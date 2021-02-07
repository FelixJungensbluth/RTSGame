var onceHp = true;
var hpUp= 0;

function setHpUp() {
    scene.socket.on('hpUp', function (up) {
            if (onceHp) {
                if(up == finalTeam) {
                    hpUp = 50;
                }
                onceHp = false;
            }
            console.log(hpUp);
        });
}
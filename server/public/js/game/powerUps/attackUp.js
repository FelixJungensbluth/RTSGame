var onceDmg = true;
var damageUp= 0;

function setAttackUp() {
    scene.socket.on('dmgUp', function (up) {
            if (onceHp) {
                if(onceDmg == finalTeam) {
                    damageUp = 10;
                }
                onceDmg = false;
            }
        });
}
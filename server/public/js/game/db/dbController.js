var playersArray = new Array();


function getPlayerName(scene) {
    scene.input.on('pointerdown', function (pointer) {
        var value = Phaser.Math.Between(0, 10);
        if (pointer.leftButtonDown()) {
            localStorage.setItem("username", "name" + value);
        }

        if (pointer.rightButtonDown()) {
            var name = localStorage.getItem("username");
            scene.socket.emit("playerName", name);
        }

    }, this);
}

function testPlayers(scene) {
    scene.socket.on('players', function (players) {
        console.log(players);
        players.forEach(element => {
            playersArray.push(element);
        });
    });
}


function setGameData(scene) {
    if (gameEnded) {
        var gameData = {
            
            p1: playersArray[0],
            p2: playersArray[playersArray.length-1],
            time: minutes + ":" + seconds,
            won: winner,
        }

        scene.socket.emit('mongo', gameData);
        gameEnded = false;
    }
}
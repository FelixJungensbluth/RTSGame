var playersArray = new Array();
var loserIndex;
var winIndex;
function getPlayerName(scene) {

    scene.socket.on('playerLost', function (players) {
        console.log(players);
        loserIndex = players;
    });

    scene.socket.on('playerWon', function (players) {
        console.log(players);
        winIndex = players;
    });
}

function testPlayers(scene) {
    scene.socket.on('players', function (players) {
        players.forEach(element => {
            playersArray.push(element);
        });
        console.log(playersArray);
    });

   
}


function setGameData(scene) {
    if (gameEnded) {
        console.log(winner);
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
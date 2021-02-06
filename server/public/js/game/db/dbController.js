var playersArray = new Array();
var loserIndex;
var winIndex;

/*
Der Spielername nach Ende des Spiels wird abgefragt 
*/
function getPlayerName(scene) {
    scene.socket.on('playerLost', function (players) {
        loserIndex = players;
    });
    scene.socket.on('playerWon', function (players) {
        winIndex = players;
    });
}

/*
Alle Spielername werden in eine Array gespeichert 
*/
function getAllPlayers(scene) {
    scene.socket.on('players', function (players) {
        players.forEach(element => {
            playersArray.push(element);
        });
        console.log(playersArray);
    });
}

/*
Wenn das Spiel beendet ist werden Daten in ein Objekt gespeichert und an der Server gesendet
*/
function setGameData(scene) {
    if (gameEnded) {
        console.log(winner);
        var gameData = {
            p1: playersArray[0],
            p2: playersArray[playersArray.length - 1],
            time: minutes + ":" + seconds,
            won: winner,
        }

        scene.socket.emit('mongo', gameData);
        gameEnded = false;
    }
}
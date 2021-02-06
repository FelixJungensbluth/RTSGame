// Initalisierung aller Module
const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const Datauri = require('datauri');
const datauri = new Datauri();
require('dotenv').config();

// MongoDB Client
const {
  MongoClient
} = require('mongodb');
const client = new MongoClient(process.env.URI);

const {
  JSDOM
} = jsdom;

var once = true;
var collection;
var collectionPlayers;
var playerArray = new Array();
var elos = new Array();

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => {};
    dom.window.gameLoaded = () => {
      server.listen(3000, async () => {
        try {
          await client.connect();
          collection = client.db("Chats").collection("chat");
          collectionPlayers = client.db("Spiele").collection("spiel");
          elo = client.db("Spielerliste").collection("spieler");
          console.log("Listening on port :%s...", server.address().port);
        } catch (e) {
          console.error(e);
        }
      });

    };
    dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();

// Routen 
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get("/chats", async (request, response) => {
  try {
    let result = await collection.findOne({
      "_id": request.query.room
    });
    response.send(result);
  } catch (e) {
    response.status(500).send({
      message: e.message
    });
  }
});

/*
Spieler werden aus der Datenbank abgefragt 
*/
async function getPlayers(socket) {
  try {
    let players = await collectionPlayers.findOne({})
    players.spieler.forEach(element => {
      playerArray.push(element);
    });
    if (playerArray.length == 2) {
      socket.emit("players", playerArray);

      /*
      playerArray.forEach(element => {
        console.log(element);
        collectionPlayers.updateOne({}, {
        "$pull": {
          "spieler": element
        }
      });
    });
     */


    }

  } catch (e) {
    console.error(e);
  }

}

io.on("connection", (socket) => {
  getPlayers(socket);
  calculateElo();

  socket.on("mongo", (data) => {
    if (once) {
      main(data.p1, data.p2, data.time, data.won).catch(console.error);
      once = false;
    }

  });

  socket.on("join", async (gameId) => {
    try {
      let result = await collection.findOne({
        "_id": gameId
      });
      if (!result) {
        await collection.insertOne({
          "_id": gameId,
          messages: []
        });
      }
      socket.join(gameId);
      socket.emit("joined", gameId);
      socket.activeRoom = gameId;
    } catch (e) {
      console.error(e);
    }
  });
  socket.on("message", (message) => {
    collection.updateOne({
      "_id": socket.activeRoom
    }, {
      "$push": {
        "messages": message
      }
    });
    io.to(socket.activeRoom).emit("message", message);
  });
});

/*
Daten werden nach jedem Spiel in die Datnbank eingefügt
*/
async function main(p1, p2, time, won) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await createListing(client, {
      spieler1: p1,
      spieler: p2,
      zeit: time,
      gewonnen: won,

    });
    await run();
    await calculateElo(winner)


  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

/*
Leerund der Chat Collection 
*/
async function run() {
  try {
    const database = client.db("Chats");
    const collection = database.collection("chat");
    // Query for all movies with the title "Santa Claus"

    const result = await collection.deleteMany({});
    console.log("Deleted " + result.deletedCount + " documents");
  } finally {
    await client.close();
  }
}

async function createListing(client, newListing) {
  const result = await client.db("Matchhistory").collection("matches").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
}


/*
Elo der Spieler werden berechnet und geupdated 
*/
async function calculateElo(winner) {

  let eloPLayer1 = await elo.findOne({
    'name': playerArray[0]
  });
  let eloPLayer2 = await elo.findOne({
    'name': playerArray[1]
  });

  elos.push(eloPLayer1);
  elos.push(eloPLayer2);

  eloGain = Math.round(((eloPLayer1 + eloPLayer2) / 2) / 100);

  for (let index = 0; playerArray < playerArray.length; index++) {
    if (winner = playerArray[i]) {
      elo.updateOne({
        "name": playerArray[i]
      }, {
        "$set": {
          "elo": elos[i] + eloGain
        }
      });
    } else if (winner != playerArray[i]) {

      elo.updateOne({
        "name": playerArray[i]
      }, {
        "$set": {
          "elo": elos[i] - eloGain
        }
      });
    }
  }
}
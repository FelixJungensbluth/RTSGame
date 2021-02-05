// Initalisierung aller Module
const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const Datauri = require('datauri');
const datauri = new Datauri();
const {
  MongoClient
} = require('mongodb');
const {
  JSDOM
} = jsdom;

var once = true;
var collection;
var collectionPlayers;
var playerArray = new Array();

const uriChat = "mongodb+srv://rtsUser:SCBV5rk8qzbRCM6d@rts.sisib.mongodb.net/Chats?retryWrites=true&w=majority";
const clientChat = new MongoClient(uriChat);

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
      // server.listen(3000, '0.0.0.0', function () {
      //  console.log(`Listening on ${server.address().port}`);
      //  });

      server.listen(3000, async () => {
        try {
          await clientChat.connect();
          collection = clientChat.db("Chats").collection("chat");
          collectionPlayers = clientChat.db("Spiele").collection("spiel");
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

async function getPlayers(socket) {
  
  try {
    let players = await collectionPlayers.findOne( {} )
    players.spieler.forEach(element => {
      playerArray.push(element);
    });
    if(playerArray.length == 2) {
      console.log(playerArray);
      socket.emit("players", playerArray);

      playerArray.forEach(element => {
        console.log(element);
        collectionPlayers.updateOne({}, {
        "$pull": {
          "spieler": element
        }
      });
    });
    

    }
   
  } catch (e) {
    console.error(e);
  }

}

io.on("connection", (socket) => {

  getPlayers(socket);

  socket.on("mongo", (data) => {
    if (once) {
      main(data.p1, data.p2, data.time, data.won).catch(console.error);
      // Query for a movie that has a title of type string
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



async function main(p1, p2, time, won) {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = "mongodb+srv://rtsUser:SCBV5rk8qzbRCM6d@rts.sisib.mongodb.net/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

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

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function run() {
  try {
    const database = clientChat.db("Chats");
    const collection = database.collection("chat");
    // Query for all movies with the title "Santa Claus"
  
    const result = await collection.deleteMany({});
    console.log("Deleted " + result.deletedCount + " documents");
  } finally {
    await clientChat.close();
  }
}

async function createListing(client, newListing) {
  const result = await client.db("game").collection("games").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
}


/*
rtsUser : USERNAME
SCBV5rk8qzbRCM6d: PASSWORT

*/
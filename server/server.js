// Initalisierung aller Module
const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const Datauri = require('datauri');
const datauri = new Datauri();
const {MongoClient} = require('mongodb');
const { JSDOM } = jsdom;

var once  = true;
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});



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
      if (blob){
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => {};
    dom.window.gameLoaded = () => {
      server.listen(3000, '0.0.0.0', function () {
        console.log(`Listening on ${server.address().port}`);
      });
    };
    dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();



async function main(p1,p2,time,won){
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
        await createListing(client,
          {
              spieler1: p1,
              spieler: p2,
              zeit: time,
              gewonnen: won,
            
          }
      );

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}



async function createListing(client, newListing){
  const result = await client.db("game").collection("games").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
}

io.on("connection", (socket) => {
  
  socket.on("mongo", (data) => {
    if(once) {
      main(data.p1,data.p2,data.time,data.won).catch(console.error);
      once = false;
    }
   
  });
});



/*
rtsUser : USERNAME
SCBV5rk8qzbRCM6d: PASSWORT

*/
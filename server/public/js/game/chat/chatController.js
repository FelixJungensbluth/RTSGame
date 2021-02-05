var textInput1;
var chat;
var showChat =false;

function setChatActive(){
    chatImg = scene.add.image(window.innerWidth - 70, window.innerHeight-310  , 'chat').setScrollFactor(0);
    chatImg.setInteractive();
    chatImg.setDepth(2001);
    chatImg.on('pointerdown', function (pointer) {
        showChat ^= true;
        if (!showChat) {
            textInput1 = scene.add.dom(window.innerWidth/2,  window.innerHeight-90).createFromCache("form").setOrigin(0.5);
            textInput1.setScrollFactor(0);
            chat = scene.add.text((window.innerWidth/2) -210, window.innerHeight-300, "", { lineSpacing: 15, backgroundColor: "#79797900", color: "#ffffff", padding: 10, fontStyle: "bold",font: "15px Arial", });
            chat.setFixedSize(400, 200);
            chat.setDepth(5000);
            chat.setScrollFactor(0);
            scene.socket.emit("join", "mongodb");
         } else if (showChat) {
             if(textInput1 && chat) {
                textInput1.destroy();
                chat.destroy();
             }
         }
    }, this);
    
}


function displayChat(scene) { 
    scene.chatMessages = [];

    setChatActive();
    scene.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  
    scene.enterKey.on("down", event => {
          let chatbox = textInput1.getChildByName("chat");
          if (chatbox.value != "") {
            var name =  playersArray[finalTeam];
            // line Break : \n
            scene.socket.emit("message", "[" + minutes + ":" + seconds+ "] "  + name + " : "+ chatbox.value);
              chatbox.value = "";
          }
      })
  
      scene.socket.connect();
  
      scene.socket.on("connect", async () => {
        scene.socket.emit("join", "mongodb");
      });
  
      scene.socket.on("joined", async (gameId) => {
          let result = await fetch("http://localhost:3000/chats?room=" + gameId).then(response => response.json());
          scene.chatMessages = result.messages;
         // scene.chatMessages.push("Welcome to " + gameId);
          if (scene.chatMessages.length > 6) {
            scene.chatMessages.shift();
          }
          chat.setText(scene.chatMessages);
      });
  
      scene.enterKey.on("down", event => {
        let chatbox = textInput1.getChildByName("chat");
        if (chatbox.value != "") {
          scene.socket.emit("message", "[" + minutes + ":" + seconds+ "] "  + name + " : "+ chatbox.value);
            chatbox.value = "";
        }
    })
  
    scene.socket.on("message", (message) => {
      scene.chatMessages.push(message);
          if(scene.chatMessages.length > 6) {
            scene.chatMessages.shift();
          }
          chat.setText(scene.chatMessages);
      });
  
  }
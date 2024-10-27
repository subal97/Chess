"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 9000 });
console.log("Server started");
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    //   ws.on('error', console.error);
    //   ws.on('message', function message(data) {
    //     console.log('received: %s', data);
    //   });
    //ws.send('connected');
    gameManager.addUser(ws);
    ws.on("close", () => {
        gameManager.removeUser(ws);
    });
});

import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 9000 });
console.log("Server started");
const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    //   ws.on('error', console.error);
    //   ws.on('message', function message(data) {
    //     console.log('received: %s', data);
    //   });
    //ws.send('connected');

    gameManager.addUser(ws);
    ws.on("close", () => {
        gameManager.removeUser(ws)
    });
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = __importDefault(require("./Game"));
const Messages_1 = require("./Messages");
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
        console.log(`User connected: ${socket}, Total users: ${this.users.length}`);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        console.log(`User removed: ${socket}, Total users: ${this.users.length}`);
        // Stop the game here as user has left
    }
    addHandler(socket) {
        socket.on("message", data => {
            const message = JSON.parse(data.toString());
            console.log(message);
            if (message.type === Messages_1.INIT_GAME) {
                if (this.pendingUser && this.pendingUser !== socket) {
                    const game = new Game_1.default(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else if (!this.pendingUser) {
                    this.pendingUser = socket;
                }
            }
            if (message.type === Messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 == socket);
                if (game) {
                    game.makeMove(message.payload);
                }
            }
            if (message.type === Messages_1.REMATCH) {
                // TODO: The current game should be removed but how. 
                // Should we mutate the games array or create a new array by filtering this one.
                const currentGame = this.games.find(game => game.player1 === socket || game.player2 == socket);
                if (currentGame) {
                    this.games = this.games.filter(game => game !== currentGame);
                    // Not changing colors here.
                    const newGame = new Game_1.default(currentGame.player1, currentGame.player2);
                    this.games.push(newGame);
                }
            }
        });
    }
}
exports.GameManager = GameManager;

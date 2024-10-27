import { WebSocket } from "ws";
import Game from "./Game";
import { INIT_GAME, MOVE, REMATCH } from "./Messages";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
        console.log(`User connected: ${socket}, Total users: ${this.users.length}`);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        console.log(`User removed: ${socket}, Total users: ${this.users.length}`);
        // Stop the game here as user has left
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", data => {
            const message = JSON.parse(data.toString());
            console.log(message);

            if (message.type === INIT_GAME) {
                if (this.pendingUser && this.pendingUser !== socket) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else if (!this.pendingUser) {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 == socket);
                if (game) {
                    game.makeMove(message.payload);
                }
            }

            if (message.type === REMATCH) {
                // TODO: The current game should be removed but how. 
                // Should we mutate the games array or create a new array by filtering this one.
                const currentGame = this.games.find(game => game.player1 === socket || game.player2 == socket);
                if (currentGame) {
                    this.games = this.games.filter(game => game !== currentGame);

                    // Not changing colors here.
                    const newGame = new Game(currentGame.player1, currentGame.player2);
                    this.games.push(newGame);
                }
            }
        })
    }
}
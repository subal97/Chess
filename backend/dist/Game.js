"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.initGame();
    }
    makeMove(move) {
        try {
            this.board.move(move);
        }
        catch (e) {
            console.error(e);
            return;
        }
        // console.log(this.board.ascii());
        // Check if game over
        if (this.isGameOver()) {
            const winner = this.board.isCheckmate() ? this.getWinner() : null;
            console.log("Game Over!");
            this.broadcastMessage(JSON.stringify({
                type: Messages_1.GAME_OVER,
                payload: { winner: winner }
            }));
            return;
        }
        // TODO: Send the updated board to appropriate players
        // const playerWithTurn = this.board.turn() === 'w' ? this.player1 : this.player2;
        this.broadcastMessage(JSON.stringify({ type: Messages_1.MOVE, payload: Object.assign({}, move) }));
    }
    rematch() {
        this.board = new chess_js_1.Chess();
        this.initGame();
    }
    initGame() {
        this.sendMessage(this.player1, JSON.stringify({
            type: Messages_1.INIT_GAME, payload: { color: "w" }
        }));
        this.sendMessage(this.player2, JSON.stringify({
            type: Messages_1.INIT_GAME, payload: { color: "b" }
        }));
    }
    broadcastMessage(message) {
        this.player1.send(message);
        this.player2.send(message);
    }
    getWinner() {
        return this.board.turn() === "w" ? "black" : "white";
    }
    // Verify checkmate, stalemate, draw, 3-fold repetition, insufficient material
    isGameOver() {
        return this.board.isGameOver();
    }
    sendMessage(player, message) {
        player.send(message);
    }
}
exports.default = Game;

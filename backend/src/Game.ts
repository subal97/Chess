import { WebSocket } from "ws";
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";

export default class Game {
    private board: Chess;
    private startTime: Date;
    player1: WebSocket;
    player2: WebSocket;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.initGame();
    }

    makeMove(move: { from: string, to: string }) {
        try {
            this.board.move(move);
        } catch (e) {
            console.error(e);
            return;
        }

        // console.log(this.board.ascii());

        // Check if game over
        if (this.isGameOver()) {
            const winner = this.board.isCheckmate() ? this.getWinner() : null;
            console.log("Game Over!");
            this.broadcastMessage(JSON.stringify(
                {
                    type: GAME_OVER,
                    payload: { winner: winner }
                }
            ));
            return;
        }

        // TODO: Send the updated board to appropriate players
        // const playerWithTurn = this.board.turn() === 'w' ? this.player1 : this.player2;
        this.broadcastMessage(JSON.stringify({ type: MOVE, payload: { ...move } }));
    }

    rematch() {
        this.board = new Chess();
        this.initGame();
    }

    private initGame() {
        this.sendMessage(this.player1, JSON.stringify({
            type: INIT_GAME, payload: { color: "w" }
        }));

        this.sendMessage(this.player2, JSON.stringify({
            type: INIT_GAME, payload: { color: "b" }
        }));
    }

    private broadcastMessage(message: string) {
        this.player1.send(message);
        this.player2.send(message);
    }

    private getWinner(): string {
        return this.board.turn() === "w" ? "black" : "white";
    }

    // Verify checkmate, stalemate, draw, 3-fold repetition, insufficient material
    private isGameOver(): boolean {
        return this.board.isGameOver();
    }

    private sendMessage(player: WebSocket, message: string) {
        player.send(message);
    }
}
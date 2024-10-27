import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "INIT_GAME";
export const MOVE = "MOVE";
export const GAME_OVER = "GAME_OVER";
export const REMATCH = "REMATCH";

export const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState("");
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setPlayerColor(message.payload.color);
          console.log("Game initiated.");
          break;
        case MOVE:
          const move: { from: string; to: string; promotion?: string } =
            message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made : " + move);
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
        case REMATCH:
          // TODO: This does not work yet!
          chess.reset();
          setBoard(chess.board());
          console.log("Resetting");
          break;
        default:
          console.log("Unknown event");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="max-w-screen-xl w-full">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            <Chessboard board={board} socket={socket} color={playerColor} />
          </div>
          <div className="col-span-2 flex flex-col justify-between p-1">
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  socket.send(JSON.stringify({ type: INIT_GAME }));
                }}
                customStyle="w-3/4 p-4 rounded-lg text-2xl font-extrabold"
              >
                Play
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  socket.send(JSON.stringify({ type: REMATCH }));
                }}
                customStyle="w-3/4 p-4 rounded-lg text-2xl font-extrabold bg-slate-500"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

const lightColor = "bg-green-200";
const darkColor = "bg-green-600";

export const Chessboard = ({
  board,
  socket,
  color,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  color: string;
}) => {
  const [move, setMove] = useState<Square | null>(null);

  const getSquare = (row: number, col: number): Square => {
    const file = String.fromCharCode(97 + col);
    const rank = (8 - row).toString();
    return (file + rank) as Square;
  };

  // Move are made using two squares i.e. to and from
  const makeMove = (row: number, col: number) => {
    const square = getSquare(row, col);

    // When setting 'to' square, only my pieces should be clickable.
    if (!move && (!board[row][col] || board[row][col].color != color)) {
      setMove(null);
      return;
    }

    setMove((prevSquare) => {
      // If a square has been already selected then make a move.
      if (prevSquare) {
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: { from: prevSquare, to: square },
          })
        );
        return null;
      }

      // If no square has been selected then set move to current square
      return square;
    });
  };

  // TODO : Invert the board for black
  return (
    <div className="text-black bg-white grid grid-rows-8 grid-cols-8">
      {board.map((row, i) =>
        row.map((square, j) => {
          const imgSrc = square
            ? `/${
                square.color == "b"
                  ? square.type + "-copy"
                  : square.type.toUpperCase()
              }.png`
            : "";

          return (
            <div
              key={j}
              onClick={() => makeMove(i, j)}
              className={`aspect-square flex justify-center items-center ${
                Boolean((i + j) & 1) ? lightColor : darkColor
              }`}
            >
              {square ? <img src={imgSrc} alt={"piece"} /> : null}
            </div>
          );
        })
      )}
    </div>
  );
};

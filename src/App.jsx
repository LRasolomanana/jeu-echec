import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState("start");
  const stockfish = useRef(null);

  useEffect(() => {
    // Créer le worker Stockfish
    stockfish.current = new Worker("/stockfish.js", { type: "module" });

    stockfish.current.onerror = (error) => {
      console.error("Worker error:", error);
    };

    stockfish.current.onmessage = (event) => {
      const line = event.data;

      if (typeof line === "string" && line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        if (move && move.length >= 4) {
          game.move({
            from: move.substring(0, 2),
            to: move.substring(2, 4),
            promotion: "q",
          });
          setPosition(game.fen());
        }
      }
    };

    // Nettoyage du worker à la fin
    return () => {
      if (stockfish.current) stockfish.current.terminate();
    };
  }, [game]);

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    // coup illégal
    if (move === null) return false;

    setPosition(game.fen());

    // IA joue ensuite
    stockfish.current.postMessage("position fen " + game.fen());
    stockfish.current.postMessage("go depth 10");
    
    return true;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        
      }}
    >
      <h1>♟️ Jeu d'échecs contre IA</h1>
      <Chessboard 
        position={position} 
        onPieceDrop={onDrop}
        boardWidth={1000}
      />
    </div>
    
  );
}

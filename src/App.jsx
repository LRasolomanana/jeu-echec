import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState("start");
  const [level, setLevel] = useState(5); // niveau par défaut
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


    // IA joue ensuite avec profondeur correspondant au niveau
    stockfish.current.postMessage("position fen " + game.fen());
    stockfish.current.postMessage(`go depth ${level}`);
    
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

      <label style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
        Niveau de l'IA :
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          style={{ marginLeft: "1rem", padding: "0.3rem" }}
        >
          <option value={1}>Très facile (depth 1)</option>
          <option value={3}>Facile (depth 3)</option>
          <option value={5}>Normal (depth 5)</option>
          <option value={8}>Difficile (depth 8)</option>
          <option value={12}>Très difficile (depth 12)</option>
          <option value={18}>Expert (depth 18)</option>
        </select>
      </label>

      <Chessboard 
        position={position} 
        onPieceDrop={onDrop}
        boardWidth={1000}
      />
    </div>
    
  );
}

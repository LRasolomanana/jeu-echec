import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState("start");
  const [level, setLevel] = useState(5);
  const [result, setResult] = useState(null);
  const stockfish = useRef(null);

  useEffect(() => {
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

          if (game.isGameOver()) {
            if (game.in_checkmate && game.in_checkmate()) {
              setResult({ type: 'checkmate', message: '♞ Les Noirs (IA) gagnent par échec et mat !' });
            } 
            else if (game.in_stalemate && game.in_stalemate()) {
              setResult({ type: 'stalemate', message: 'Partie nulle (pat).' });
            } 
            else if (game.in_draw && game.in_draw()) {
              setResult({ type: 'draw', message: 'Partie nulle.' });
            } 
            else {
              setResult({ type: 'gameover', message: 'Partie terminée.' });
            }
          }
        }
      }
    };

    return () => {
      if (stockfish.current) stockfish.current.terminate();
    };
  }, [game]);

  const resetGame = () => {
    const g = new Chess();
    setGame(g);
    setPosition("start");
    setResult(null);
    if (stockfish.current) stockfish.current.postMessage("ucinewgame");
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setPosition(game.fen());

    if (game.isGameOver()) {
      if (game.in_checkmate && game.in_checkmate()) {
        setResult({ type: 'checkmate', message: '♟ Les Blancs gagnent par échec et mat !' });
        return true;
      } else if (game.in_stalemate && game.in_stalemate()) {
        setResult({ type: 'stalemate', message: 'Partie nulle (pat).' });
        return true;
      } else if (game.in_draw && game.in_draw()) {
        setResult({ type: 'draw', message: 'Partie nulle.' });
        return true;
      }
    }

    stockfish.current.postMessage("position fen " + game.fen());
    stockfish.current.postMessage(`go depth ${level}`);

    return true;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
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

      {result && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: 'rgba(0,0,0,0.9)', padding: '2rem 3rem', borderRadius: '8px', color: 'white', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.6rem', marginBottom: '1.5rem' }}>{result.message}</h2>
            <button onClick={resetGame} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '1.1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Rejouer</button>
          </div>
        </div>
      )}

      <Chessboard position={position} onPieceDrop={onDrop} boardWidth={1000} />
    </div>
  );
}

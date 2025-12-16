import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "./App.css";


export default function App() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState("start");
  const [level, setLevel] = useState(5);
  const [history, setHistory] = useState([]);
  const [timeWhite, setTimeWhite] = useState(600);
  const [timeBlack, setTimeBlack] = useState(600);
  const [turn, setTurn] = useState("w");
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const stockfish = useRef(null);
  const navigate = useNavigate();

  // Initialisation Stockfish
  useEffect(() => {
    stockfish.current = new Worker("/stockfish.js", { type: "module" });

    stockfish.current.onmessage = (event) => {
      const line = event.data;
      if (typeof line === "string" && line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        if (!move || move === "(none)") return;

        game.move({
          from: move.slice(0, 2),
          to: move.slice(2, 4),
          promotion: "q",
        });

        setPosition(game.fen());
        setHistory(game.history());
        setTurn("w");
      }
    };

    return () => stockfish.current?.terminate();
  }, [game]);

  // Timer (démarre après le premier coup des Blancs)
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      if (turn === "w") setTimeWhite((t) => Math.max(t - 1, 0));
      else setTimeBlack((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, gameStarted]);

  const resetGame = () => {
    const g = new Chess();
    setGame(g);
    setPosition("start");
    setHistory([]);
    setTimeWhite(600);
    setTimeBlack(600);
    setTurn("w");
    setGameStarted(false);
    stockfish.current?.postMessage("ucinewgame");
  };

  // Coup des Blancs
  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (!move) return false;

    if (!gameStarted) setGameStarted(true);

    setPosition(game.fen());
    setHistory(game.history());
    setTurn("b");

    stockfish.current.postMessage("position fen " + game.fen());
    stockfish.current.postMessage(`go depth ${level}`);

    return true;
  };

  const formatTime = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="app">
      <nav className="nav">
        <h2>♟ Chess</h2>
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <button onClick={() => navigate('/auth/login')}>Connexion</button>
          <button onClick={resetGame}>Nouvelle partie</button>
          <button onClick={() => navigate('/rules/rules')}>Règles</button>
          <select value={level} onChange={(e) => setLevel(+e.target.value)}>
            <option value={1}>IA facile</option>
            <option value={5}>IA normale</option>
            <option value={12}>IA difficile</option>
          </select>
        </div>
      </nav>

      <div className="content">
        <div className="side">
          <div>⏱ Blancs : {formatTime(timeWhite)}</div>
          <div>⏱ Noirs : {formatTime(timeBlack)}</div>
          <h3>Historique</h3>
          <ol className="history">{history.map((m, i) => <li key={i}>{m}</li>)}</ol>
        </div>

        <div className="board">
          <Chessboard
            position={position}
            onPieceDrop={onDrop}
            boardWidth={Math.min(window.innerWidth, window.innerHeight - 80)}
          />
        </div>
      </div>
    </div>
  );
}

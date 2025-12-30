import { useEffect, useState } from "react";
import { socket, connectSocket, sendMove } from "./socket/socket";
import Board from "./components/Board";
import UsernameForm from "./components/UsernameForm";
import GameStatus from "./components/GameStatus";
import Leaderboard from "./components/Leaderboard";

export default function App() {
  const [username, setUsername] = useState("");
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("Enter username");

  function handleJoin(name) {
    setUsername(name);
    connectSocket(name);
    setStatus("Waiting for opponent...");
  }

  function handleMove(col) {
    if (game) {
      sendMove(game.gameId, col);
    }
  }

  useEffect(() => {
    socket.on("MATCH_FOUND", data => {
      setStatus(`Playing vs ${data.opponent}`);
      setGame({ gameId: data.gameId, board: Array(6).fill().map(() => Array(7).fill(null)) });
    });

    socket.on("GAME_UPDATE", gameData => {
      setGame(gameData);
      setStatus(`Turn: ${gameData.currentTurn}`);
    });

    socket.on("GAME_OVER", data => {
      if (data.game) setGame(data.game);
      setStatus(`Winner: ${data.winner}`);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 bg-gradient-to-b from-sky-900 to-indigo-900 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold">4 in a Row</h1>
          <div className="hidden sm:block text-sm opacity-80">Have fun — connect four!</div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 flex flex-col items-center">
            <div className="w-full bg-slate-800/40 p-4 rounded-lg shadow-lg">
              {!username && <div className="mb-4"><UsernameForm onSubmit={handleJoin} /></div>}

              {game ? (
                <Board board={game.board} onMove={handleMove} players={game.players} isBotGame={game.isBotGame} />
                    ) : (
                <div className="py-12 text-center text-gray-300">Waiting for match... Join to start</div>
              )}

              <div className="mt-4"><GameStatus status={status} /></div>
            </div>
          </section>

          <aside className="md:col-span-1">
            <Leaderboard />
          </aside>
        </main>
      </div>
    </div>
  );
}

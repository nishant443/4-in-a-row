import { useEffect, useState, useRef } from "react";
import { socket, connectSocket, sendMove } from "./socket/socket";
import Board from "./components/Board";
import UsernameForm from "./components/UsernameForm";
import GameStatus from "./components/GameStatus";
import Leaderboard from "./components/Leaderboard";
import WinnerPanel from "./components/WinnerPanel";
import { playMoveSound, playWinSound, unlockAudioOnUserGesture, setMuted, isMuted } from "./utils/sound";

export default function App() {
  const [username, setUsername] = useState("");
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("Enter username");
  const [winner, setWinner] = useState(null);
  const [flashOpponentMove, setFlashOpponentMove] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [mutedState, setMutedState] = useState(!!isMuted() || (localStorage.getItem('muted') === 'true'));
  const lastMovesRef = useRef(0);
  const usernameRef = useRef(username);

  // ensure audio can play after first interaction
  useEffect(() => unlockAudioOnUserGesture(), []);

  // keep usernameRef in sync with username state
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  // initialize mute from localStorage/state
  useEffect(() => {
    setMuted(!!mutedState);
    try { localStorage.setItem('muted', mutedState ? 'true' : 'false'); } catch (e) {}
  }, [mutedState]);

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
      setWinner(null);
      setGame({ gameId: data.gameId, board: Array(6).fill().map(() => Array(7).fill(null)), players: [usernameRef.current, data.opponent] });
    });

    socket.on("GAME_UPDATE", gameData => {
      // play move sound only when moves array grows
      const prevLen = lastMovesRef.current || 0;
      const newLen = (gameData.moves && gameData.moves.length) || 0;
      if (newLen > prevLen) {
        const last = gameData.moves[newLen - 1];
        const isOpponent = last.player !== usernameRef.current;
        playMoveSound(isOpponent);
        setLastMove(last);
        if (isOpponent) {
          setFlashOpponentMove(true);
          setTimeout(() => setFlashOpponentMove(false), 800);
        }
      }
      lastMovesRef.current = newLen;

      setGame(gameData);
      setStatus(`Turn: ${gameData.currentTurn}`);
    });

    socket.on("GAME_OVER", data => {
      if (data.game) setGame(data.game);
      setStatus(`Winner: ${data.winner}`);
      setWinner(data.winner);
      const isWinner = data.winner === usernameRef.current;
      playWinSound(isWinner);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="min-h-screen px-2 py-8 sm:px-6 bg-gradient-to-b from-sky-900 to-indigo-900 text-gray-100">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold">4 in a Row</h1>
            <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm opacity-80">Have fun — connect four!</div>
            <button
              className="bg-white/6 p-2 rounded-md hover:bg-white/10 flex items-center justify-center"
              onClick={() => setMutedState(s => !s)}
              aria-pressed={mutedState}
              aria-label={mutedState ? 'Unmute' : 'Mute'}
            >
              {mutedState ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5v14l11-7L9 5z" />
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 2l20 20" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5v14l11-7L9 5z" />
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 010 0" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 flex flex-col items-center">
            <div className="w-full bg-slate-800/40 p-4 rounded-lg shadow-lg">
              {!username && <div className="mb-4"><UsernameForm onSubmit={handleJoin} /></div>}

              {game ? (
                <div className={`${flashOpponentMove ? 'ring-4 ring-amber-400 animate-pulse rounded-lg' : ''}`}>
                  <Board board={game.board} onMove={handleMove} players={game.players} isBotGame={game.isBotGame} lastMove={lastMove} currentUsername={username} />
                </div>
                    ) : (
                <div className="py-12 text-center text-gray-300">Waiting for match... Join to start</div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <GameStatus status={status} />
                {game && username && game.currentTurn === username && (
                  <div className="text-amber-300 font-semibold px-3 py-1 bg-amber-900/20 rounded-full animate-pulse">Your Turn</div>
                )}
              </div>
            </div>
          </section>

          <aside className="md:col-span-1">
            <div className="space-y-4">
              <WinnerPanel winner={winner} />
              <Leaderboard />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

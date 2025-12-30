import Cell from "./Cell";

export default function Board({ board, onMove, players = [], isBotGame = false }) {
    return (
        <div className="w-full max-w-[360px] sm:max-w-[480px] md:max-w-[640px] mx-auto p-3 bg-gradient-to-b from-slate-800 to-slate-700 rounded-lg shadow-inner">
            <div className="w-full bg-sky-700 rounded">
                <div className="grid grid-cols-7 gap-2 p-3" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {board.map((row, r) =>
                        row.map((cell, c) => (
                            <div key={r + "-" + c} className="w-full">
                                <Cell
                                    value={cell}
                                    onClick={() => onMove(c)}
                                    players={players}
                                    isBotGame={isBotGame}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

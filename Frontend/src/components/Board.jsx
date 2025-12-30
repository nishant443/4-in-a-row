import Cell from "./Cell";

export default function Board({ board, onMove, players = [], isBotGame = false }) {
    return (
        <div
            className="w-full mx-auto p-0 sm:p-3 bg-gradient-to-b from-slate-800 to-slate-700 rounded-lg shadow-inner"
            style={{ width: 'min(98vw, 900px)', maxWidth: '98vw' }}
        >
            <div className="w-full bg-sky-700 rounded">
                <div className="grid grid-cols-7 gap-1 sm:gap-3 p-1 sm:p-4" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
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

import Cell from "./Cell";

export default function Board({ board, onMove }) {
    return (
        <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[560px] mx-auto p-3 bg-gradient-to-b from-slate-800 to-slate-700 rounded-lg shadow-inner">
            <div className="grid grid-cols-7 gap-2 p-3 bg-sky-700 rounded">
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <Cell key={r + "-" + c} value={cell} onClick={() => onMove(c)} />
                    ))
                )}
            </div>
        </div>
    );
}

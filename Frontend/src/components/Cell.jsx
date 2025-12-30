export default function Cell({ value, onClick, players = [], isBotGame = false }) {
    const has = value !== null && value !== undefined;

    // Determine disc color:
    // - empty -> white
    // - if isBotGame: BOT -> red, human -> yellow
    // - else (two humans): players[0] -> red, players[1] -> yellow
    let discClass = "bg-white";
    if (has) {
        if (isBotGame) {
            discClass = value === "BOT" ? "bg-red-500" : "bg-yellow-400";
        } else {
            if (players && players[0] && value === players[0]) discClass = "bg-red-500";
            else discClass = "bg-yellow-400";
        }
    }

    return (
        <button onClick={onClick} className="w-full aspect-square p-1 flex items-center justify-center cursor-pointer">
            <div className="w-full h-full bg-transparent rounded-lg flex items-center justify-center">
                <div className={`w-11/12 h-11/12 md:w-4/5 md:h-4/5 lg:w-3/5 lg:h-3/5 rounded-full border-2 border-slate-700 transition-transform duration-150 ease-out ${discClass} ${has ? 'scale-100 shadow-lg' : 'scale-95'}`} />
            </div>
        </button>
    );
}

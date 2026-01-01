export default function WinnerPanel({ winner, onClose }) {
    if (!winner) return null;

    return (
        <div className="mb-4">
            <div className="transform transition-all duration-700 ease-out origin-left scale-100">
                <div className="bg-gradient-to-r from-amber-400 to-pink-500 text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
                    <div className="text-2xl">🏆</div>
                    <div className="flex flex-col">
                        <div className="text-sm uppercase opacity-80">Winner</div>
                        <div className="font-extrabold text-lg tracking-tight">{winner}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

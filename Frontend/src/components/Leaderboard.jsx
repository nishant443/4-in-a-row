import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/leaderboard";

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchLeaderboard().then(setPlayers);
    }, []);

    const topPlayers = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 5);

    return (
        <div className="w-full bg-white/5 p-4 rounded-lg shadow-md text-sm">
            <h2 className="text-lg font-semibold mb-3">Leaderboard</h2>
            <div className="space-y-2">
                {players.length === 0 && <div className="text-gray-300">No data yet</div>}
                {topPlayers.map((p, idx) => (
                    <div key={p.username} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                            <div className="opacity-90">{p.username}</div>
                        </div>
                        <div className="text-yellow-300 font-medium">{p.wins} wins</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

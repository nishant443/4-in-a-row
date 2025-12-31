import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchLeaderboard() {
    try {
        const res = await axios.get(`${API_URL}/leaderboard`);
        return res.data;
    } catch (err) {
        console.error("Leaderboard fetch failed:", err);
        return [];
    }
}

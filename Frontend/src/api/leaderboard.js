import axios from "axios";

const API_URL = "http://localhost:5000";

export async function fetchLeaderboard() {
    const res = await axios.get(`${API_URL}/leaderboard`);
    return res.data;
}

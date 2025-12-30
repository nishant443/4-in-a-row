import { useState } from "react";

export default function UsernameForm({ onSubmit }) {
    const [name, setName] = useState("");

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start w-full">
            <input
                className="border rounded px-3 py-2 w-full sm:w-48 md:w-64 text-white placeholder-slate-200 bg-slate-800/40 border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="username"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button
                className="bg-amber-400 text-slate-900 px-4 py-2 rounded font-semibold shadow w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer hover:shadow-lg"
                onClick={() => onSubmit(name)}
            >
                Join
            </button>
        </div>
    );
}

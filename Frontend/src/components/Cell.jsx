export default function Cell({ value, onClick }) {
    const has = value !== null && value !== undefined;
    const discBg = has ? (value === "BOT" ? "bg-red-500" : "bg-yellow-400") : "bg-white";

    return (
        <div onClick={onClick} className="p-1 flex items-center justify-center cursor-pointer w-12 h-12 md:w-16 md:h-16">
            <div className="w-full h-full bg-transparent rounded-lg flex items-center justify-center">
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-slate-700 transition-transform duration-150 ease-out ${discBg} ${has ? 'scale-100 shadow-lg' : 'scale-95'}`} />
            </div>
        </div>
    );
}

const waitingQueue = [];
// Per requirements: start bot after 10 seconds if no opponent
const BOT_TIMEOUT = 10 * 1000; // 10 seconds

function enqueuePlayer(username, onBotTimeout) {
    // Prevent duplicates
    if (waitingQueue.includes(username)) return null;

    // If someone is already waiting → match immediately
    if (waitingQueue.length > 0) {
        return waitingQueue.shift();
    }

    // Otherwise, wait
    waitingQueue.push(username);

    setTimeout(() => {
        const index = waitingQueue.indexOf(username);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            onBotTimeout(username); // start bot game
        }
    }, BOT_TIMEOUT);

    return null;
}

function removeFromQueue(username) {
    const index = waitingQueue.indexOf(username);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
    }
}

module.exports = {
    enqueuePlayer,
    removeFromQueue
};

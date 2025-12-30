 # 4 in a Row — Project README

 This repository contains a real-time multiplayer Connect Four style game with a Node.js backend and a React + Vite frontend. It includes socket-based gameplay, analytics via Kafka, persistent game storage (MongoDB), matchmaking, and a leaderboard service.

 ---

 ## Contents / High-level summary

 - `Backend/` — Express + Socket.IO server and game logic
 - `Frontend/` — Vite React app with Tailwind CSS UI
 - `kafka/` — lightweight analytics producer/consumer scripts used by the project
 - `docker-compose.yml` — optional composition for local services (Mongo, Kafka, etc.)

 ## Project structure (detailed)

 - Backend/
   - `package.json` — server dependencies and scripts
   - `src/`
     - `app.js` — main Express app (routes, middleware)
     - `server.js` — HTTP server + Socket.IO wiring
     - `config/` — configuration modules
       - `db.js` — database connection (Mongo)
       - `kafka.js` — Kafka producer/consumer config
       - `socket.js` — socket options and helpers
     - `game/` — core gameplay logic
       - `boardLogic.js` — board representation, `dropDisc`, win/draw detection
       - `botEngine.js` — simple bot move strategy
       - `gameManager.js` — in-memory game registry (create/get/remove games)
       - `reconnect.js` — reconnect handling and timers
     - `matchmaking/`
       - `queue.js` — simple FIFO match queue and bot fallback
     - `models/` — Mongoose schemas
       - `Game.js` — stores finished games and move history
       - `Player.js`, `Analytics.js` — other models used by services
     - `routes/` — optional REST endpoints (e.g. leaderboard fetch)
     - `services/` — small service layers
       - `analytics.js` — pushes analytics events (via Kafka)
       - `leaderboard.js` — updates/reads players' win counts
     - `sockets/` — socket handlers
       - `game.socket.js` — `JOIN`, `MOVE`, `GAME_UPDATE`, `GAME_OVER` handling

 - Frontend/
   - `package.json` — UI dependencies and scripts
   - `index.html`, `vite.config.js` — Vite setup
   - `src/`
     - `main.jsx`, `App.jsx` — React entry + app layout
     - `components/` — UI components: `Board.jsx`, `Cell.jsx`, `GameStatus.jsx`, `Leaderboard.jsx`, `UsernameForm.jsx`
     - `socket/` — client socket wrapper (`socket.js`)
     - `api/` — small fetch wrappers for leaderboard endpoints
     - `index.css`, `App.css` — Tailwind import and custom styles
   - `tailwind.config.js` — Tailwind configuration

 - `kafka/`
   - `analyticsService.js`, `consumer.js` — example scripts used locally for analytics

 ---

 ## Backend — architecture and detailed explanation

 The backend uses a mixture of HTTP endpoints and Socket.IO for real-time gameplay. Key concepts:

 - Socket-based matchmaking and gameplay
   - Clients connect via Socket.IO and emit `JOIN` to enter the matchmaking queue.
   - The server pairs players (or pairs with the `BOT`) and creates a `game` object (in-memory).
   - Game events are broadcast to players using `GAME_UPDATE` for the current board and `GAME_OVER` when finished.
   - Moves are sent as `MOVE` events with payload `{ gameId, col }`. The server uses `dropDisc(board, col, player)` to place the disc at the lowest available row in that column.

 - Game lifecycle (high level)
   1. Player A joins → placed in queue
   2. Player B joins → server creates a game via `gameManager.createGame`
   3. Server emits `MATCH_FOUND` and initial `GAME_UPDATE`
   4. Players emit `MOVE` events; server validates turn and uses `dropDisc` to apply the move
   5. After each move server checks `checkWin` and `isDraw`
   6. If win/draw → server persists the finished `Game` in MongoDB and emits final `GAME_UPDATE` and `GAME_OVER` including final board

 - Persistence and analytics
   - Finished games are inserted into MongoDB (`models/Game.js`) including move list and metadata (duration, players, winner).
   - The `services/analytics` publishes events (e.g., `GAME_END`) to Kafka for downstream processing or dashboards. The `kafka/` folder contains small consumer examples.

 - Matchmaking details
   - `matchmaking/queue.js` implements a simple queue. A callback can create a `BOT` game if no human opponent is available for a short time.

 - Reconnect handling
   - Server keeps simple reconnect timers per user to allow rejoin; if a user disconnects and reconnects quickly they can reattach to the existing game.

 Security and validation
 - The server validates that a `MOVE` comes from the player whose turn it is. It also checks column bounds and occupancy via `dropDisc` result.
 - The server persists only completed games; any intermediate game state is kept in memory.

 Scaling notes
 - Games are stored in-memory (Map). For horizontal scaling you must move game state to a shared store (Redis) or route specific sockets to a single game-hosting node via sticky sessions.
 - Kafka and Mongo scale independently and are suitable for production use when configured correctly.

 ---

 ## Frontend — quick overview

 - Uses React + Vite + Tailwind CSS
 - Socket wrapper in `src/socket/socket.js` exposes `connectSocket`, `sendMove` and the `socket` instance.
 - UI components:
   - `Board.jsx` renders a 7×6 grid; clicking a column emits `sendMove(gameId, col)` which instructs the server to drop a disc.
   - `Cell.jsx` renders discs and their colors; `GameStatus` shows the current status.
   - `Leaderboard.jsx` fetches leaderboard data and shows top players.

 ---

 ## Event flow (simplified sequence)

 Client A                 Server                    Client B
    |        JOIN          |                          |
    |--------------------->|                          |
    |        MATCH_FOUND   |                          |
    |<---------------------|                          |
    |   GAME_UPDATE(board) |                          |
    |<---------------------|                          |
    |   MOVE {gameId,col}  |                          |
    |--------------------->|  dropDisc -> board'      |
    |                      |------------------------->|
    |                      |  GAME_UPDATE(board')     |
    |<---------------------|                          |

 When a win is detected the server emits the final board (`GAME_UPDATE`) and `GAME_OVER` (contains `{ winner, game }`).

 ---

 ## Environment variables

 Common env vars used by the repo (edit `.env` in Backend/):

 - `PORT` — server port (default: 5000)
 - `MONGO_URI` — MongoDB connection string
 - `KAFKA_BROKERS` — Kafka bootstrap servers (if using analytics)
 - `JWT_SECRET` — (not required in this simple app) for authentication if you add it

 ---

 ## Local development

 1. Start services (MongoDB, Kafka) or use `docker-compose` if configured:

 ```bash
 docker compose up
 ```

 2. Backend

 ```bash
 cd Backend
 npm install
 npm run dev
 ```

 3. Frontend

 ```bash
 cd Frontend
 npm install
 npm run dev
 ```

 Open the frontend address shown by Vite (usually http://localhost:5173) and open two browser windows to test multiplayer.

 ---

 ## Tests & Debugging

 - Use browser devtools -> Console / Network(WebSocket) to inspect `GAME_UPDATE` and `GAME_OVER` events.
 - Server logs will show matchmaking and game events. If a winner isn't reflected in the UI, inspect that the server emits the final `GAME_UPDATE` and `GAME_OVER` payloads.

 ---

 ## Deployment notes

 - For a production deployment:
   - Use PM2 or Docker to run the backend processes.
   - Use a managed MongoDB (Atlas) and a hosted Kafka (Confluent Cloud) or run Kafka in Docker with proper Zookeeper/replication.
   - Configure CORS and appropriate socket origins in `server.js`.

 ---

 ## Project Architecture (textual)

 1. Clients (React) connect to server via Socket.IO.
 2. Server (Node/Express) hosts Socket.IO and a few REST endpoints.
 3. Game state: in-memory per game (Map). Persistence only at game end in MongoDB.
 4. Analytics: server publishes events to Kafka; separate consumers can run analysis dashboards.
 5. Leaderboard service updates player stats either via direct DB updates or via events consumed from Kafka.

 Diagram (ASCII):

 Client(s) <----> Socket.IO Server <----> MongoDB
                        |
                        +----> Kafka (analytics producer)
                                    |
                                    +----> Analytics Consumer / Dashboard

 ---

 ## Next steps / Suggested improvements

 - Move live game state to Redis for clustering and persistence.
 - Add authentication and user profiles.
 - Add replay functionality for past games.
 - Improve bot AI and add difficulty levels.
 - Add mobile-specific UI optimizations and animations for disc drops.

 ---

 If you'd like, I can:
 - Add a PlantUML or image architecture diagram.
 - Add a CONTRIBUTING.md with development workflow.

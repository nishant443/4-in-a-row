# 🎯 4-in-a-Row — Real-Time Multiplayer Game

A real-time Connect-Four multiplayer game built with Node.js, WebSockets, MongoDB, and Kafka. Players can compete head-to-head or face off against a competitive AI bot that thinks strategically.

---

## 🌐 Live Demo

**Frontend:** [https://four-in-a-row-1-ugzk.onrender.com](https://four-in-a-row-1-ugzk.onrender.com)  
**Backend:** [https://four-in-a-row-ve50.onrender.com](https://four-in-a-row-ve50.onrender.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Game Logic](#-game-logic)
- [Bot Strategy](#-bot-strategy)
- [Engineering Decisions](#-engineering-decisions)

---

## ✨ Features

### 🎮 Core Gameplay
- **7×6 Connect-Four Grid** — Classic game board
- **Real-Time Multiplayer** — WebSocket-powered turn-based gameplay
- **Player vs Player** — Compete against real opponents
- **Player vs Bot** — AI opponent joins if no player found within 30 seconds
- **Win Detection** — Horizontal, vertical, and diagonal connections
- **Draw Detection** — Automatic detection when board is full

### 🤖 Competitive AI Bot
The bot plays strategically by:
- **Winning when possible** — Takes opportunities to complete 4-in-a-row
- **Blocking player wins** — Prevents opponent from winning
- **Strategic positioning** — Prioritizes center columns and high-potential moves
- **No random moves** — Every move is calculated

### 🔄 Reconnection System
- Players can disconnect and rejoin within **30 seconds**
- Game state is preserved during disconnection
- Automatic forfeit if player doesn't return in time
- Opponent or bot wins by default on forfeit

### 🏆 Leaderboard
Tracks player statistics:
- Total wins
- Total losses
- Games played
- Real-time updates displayed in frontend

### 📊 Analytics (Kafka Integration)
Event-driven analytics tracking:
- Game completion events
- Player statistics
- Game duration
- Move counts
- Winner information

---

## 🛠 Tech Stack

### Backend
- **Node.js** — Runtime environment
- **Express** — Web framework
- **Socket.IO** — Real-time bidirectional communication
- **MongoDB** — NoSQL database for persistence
- **Mongoose** — MongoDB object modeling
- **Kafka (KafkaJS)** — Event streaming platform
- **UUID** — Unique identifier generation

### Frontend
- **React** — UI framework
- **Vite** — Build tool and dev server
- **Socket.IO Client** — WebSocket client
- **Axios** — HTTP client
- **Tailwind CSS** — Utility-first styling

### Infrastructure
- **Render** — Cloud hosting platform
- **Docker** — Local containerization for MongoDB and Kafka

---

## 📂 Project Structure

### Backend Structure
```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection setup
│   │   ├── kafka.js           # Kafka producer configuration
│   │   └── socket.js          # Socket.IO initialization
│   │
│   ├── game/
│   │   ├── boardLogic.js      # Win/draw detection logic
│   │   ├── botEngine.js       # AI bot strategy implementation
│   │   ├── gameManager.js     # Active game state management
│   │   └── reconnect.js       # Player reconnection handling
│   │
│   ├── matchmaking/
│   │   └── queue.js           # Player queue and matching logic
│   │
│   ├── models/
│   │   ├── Analytics.js       # Analytics data schema
│   │   ├── Game.js            # Game state schema
│   │   └── Player.js          # Player profile schema
│   │
│   ├── routes/
│   │   └── leaderboard.js     # Leaderboard API routes
│   │
│   ├── services/
│   │   ├── analytics.js       # Analytics event processing
│   │   ├── gameService.js     # Game business logic
│   │   └── leaderboard.js     # Leaderboard data aggregation
│   │
│   ├── sockets/
│   │   ├── game.socket.js     # Game-related socket handlers
│   │   └── player.socket.js   # Player connection handlers
│   │
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
│
├── .env
├── package.json
└── package-lock.json
```

### Frontend Structure
```
Frontend/
├── public/                     # Static assets
│
├── src/
│   ├── api/
│   │   └── leaderboard.js     # API service for leaderboard
│   │
│   ├── assets/                # Images, icons, etc.
│   │
│   ├── components/
│   │   ├── Board.jsx          # Game board grid component
│   │   ├── Cell.jsx           # Individual cell component
│   │   ├── GameStatus.jsx     # Turn/status indicator
│   │   ├── Leaderboard.jsx    # Leaderboard display
│   │   ├── UsernameForm.jsx   # Username entry form
│   │   └── WinnerPanel.jsx    # Game result display
│   │
│   ├── socket/
│   │   └── socket.js          # Socket.IO client setup
│   │
│   ├── utils/
│   │   └── sound.js           # Audio effects (optional)
│   │
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   └── App.css                # App-specific styles
│
├── .env
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

### Kafka Service Structure
```
kafka/
├── consumer.js               # Kafka consumer implementation
└── analyticsService.js       # Analytics processing service
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** (for local MongoDB and Kafka)
- **MongoDB** (local or cloud instance)

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/four-in-a-row.git
cd four-in-a-row
```

#### 2️⃣ Start MongoDB & Kafka (Local Development)
```bash
docker compose up -d
```

This starts:
- MongoDB on `localhost:27017`
- Kafka on `localhost:9092`

#### 3️⃣ Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/four-in-a-row
KAFKA_ENABLED=true
KAFKA_BROKER=localhost:9092
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

Backend will run at **http://localhost:5000**

#### 4️⃣ Setup Frontend
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run at **http://localhost:5173**

#### 5️⃣ (Optional) Start Kafka Consumer
```bash
cd kafka
npm install
node consumer.js
```

---

## ⚙️ Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/four-in-a-row` |
| `KAFKA_ENABLED` | Enable/disable Kafka analytics | `true` or `false` |
| `KAFKA_BROKER` | Kafka broker address | `localhost:9092` |
| `PORT` | Backend server port | `5000` |

### Frontend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:5000` |

**Note:** On Render, Kafka is disabled (`KAFKA_ENABLED=false`) as Render does not support Kafka brokers in the free tier.

---

## 🎮 Game Logic

### Board Mechanics
- **Grid Size:** 7 columns × 6 rows
- **Turn-Based:** Players alternate placing discs
- **Gravity:** Discs fall to the lowest available position in a column

### Win Conditions
A player wins by connecting **4 discs** in any of these patterns:
- **Horizontal** — Four consecutive discs in a row
- **Vertical** — Four consecutive discs in a column
- **Diagonal** — Four consecutive discs diagonally (↗ or ↘)

### Draw Condition
If all 42 cells are filled with no winner, the game ends in a draw.

---

## 🤖 Bot Strategy

The AI bot uses a **heuristic-based evaluation system** to make intelligent moves:

### Priority Order
1. **Win Immediately** — If the bot can win in one move, it takes it
2. **Block Player Win** — If the player can win next turn, bot blocks them
3. **Center Preference** — Prioritizes center columns (columns 3, 4) for better positioning
4. **Strategic Positioning** — Evaluates moves based on potential winning paths

### Bot Algorithm
```
For each possible move:
  1. Check if move wins the game → play it
  2. Check if move blocks opponent win → play it
  3. Evaluate strategic value of position
  4. Choose move with highest strategic value
```

This creates a **challenging but beatable** opponent that plays logically without being perfect.

---

## 🏗 Engineering Decisions

### Why Single Backend Instance?

The current architecture uses:
- **In-memory game state** — Active games stored in memory
- **In-memory matchmaking queue** — Player queue maintained in memory

**Benefits of single instance:**
- Simplified matchmaking logic
- No race conditions in game state
- Stable bot timer management
- Guaranteed message delivery order

**For horizontal scaling, you would need:**
- Redis for shared state
- Sticky sessions for WebSocket connections
- Distributed locking for game state

### Why WebSockets (Socket.IO)?
- **Real-time updates** — Instant move synchronization
- **Bidirectional communication** — Server can push updates to clients
- **Reconnection support** — Built-in reconnection handling
- **Room-based messaging** — Easy game isolation

### Why MongoDB?
- **Flexible schema** — Easy to iterate on data models
- **JSON-like documents** — Natural fit for JavaScript/Node.js
- **Quick prototyping** — Fast development cycle
- **Aggregation pipeline** — Powerful leaderboard queries

### Why Kafka?
- **Event-driven architecture** — Decouples analytics from game logic
- **Scalable analytics** — Process events asynchronously
- **Production-ready pattern** — Industry-standard approach
- **Future extensibility** — Easy to add more consumers

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Your Name**
- GitHub: [@nishant443](https://github.com/nishant443)

---

**⭐ If you found this project helpful, please consider giving it a star!**

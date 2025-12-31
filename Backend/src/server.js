const http = require("http");
require("dotenv").config();
const app = require("./app");
const { initSocket } = require("./config/socket");
const connectDB = require("./config/db");
const { connectKafka } = require("./config/kafka");

async function start() {
  await connectDB();
  // try connect kafka but don't crash if not available
  connectKafka().catch(e => console.warn("Kafka connect failed:", e));

  const server = http.createServer(app);
  initSocket(server);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Game server running on port ${PORT}`);
  });
}

start();

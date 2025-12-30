const { Kafka } = require("kafkajs");

let kafkaProducer = null;

async function connectKafka() {
    // 🚫 Disable Kafka when not configured
    if (process.env.KAFKA_ENABLED !== "true") {
        console.log("Kafka disabled (no broker configured)");
        return null;
    }

    const kafka = new Kafka({
        clientId: "connect4-game",
        brokers: [process.env.KAFKA_BROKER],
    });

    kafkaProducer = kafka.producer();

    try {
        await kafkaProducer.connect();
        console.log("Kafka Producer connected");
    } catch (err) {
        console.error("Kafka connection failed. Running without Kafka.");
        kafkaProducer = null;
    }

    return kafkaProducer;
}

function getProducer() {
    return kafkaProducer;
}

module.exports = { connectKafka, getProducer };

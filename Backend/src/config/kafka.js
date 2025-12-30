const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "connect4-game",
    brokers: [process.env.KAFKA_BROKER]
});

const kafkaProducer = kafka.producer();

async function connectKafka() {
    await kafkaProducer.connect();
    console.log("Kafka Producer connected");
}

module.exports = { kafkaProducer, connectKafka };

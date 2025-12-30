require("dotenv").config();
const { Kafka } = require("kafkajs");
const { saveAnalytics } = require("./analyticsService");

const kafka = new Kafka({
    clientId: "connect4-analytics",
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: "connect4-group" });

async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: "game.analytics", fromBeginning: true });

    console.log("Kafka Consumer running...");

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());
            await saveAnalytics(event);
        }
    });
}

startConsumer();

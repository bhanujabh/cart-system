// shared/rabbitmq.js
const amqplib = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log(`✅ Connected to RabbitMQ`);
  }
  return { connection, channel };
}

function sendToQueue(queueName, message) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
};

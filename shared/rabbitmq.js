// shared/rabbitmq.js
const amqplib = require('amqplib');

let channel;

async function connectRabbitMQ(queueName) {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`✅ Connected to RabbitMQ. Queue: ${queueName}`);
  return channel;
}

function sendToQueue(queueName, message) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
};

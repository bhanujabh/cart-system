const amqp = require('amqplib');

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("notification-queue");
}

function sendToQueue(data) {
  channel.sendToQueue("notification-queue", Buffer.from(JSON.stringify(data)));
}

module.exports = { connectQueue, sendToQueue };

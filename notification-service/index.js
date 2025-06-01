const express = require('express');
const dotenv = require('dotenv');
const amqp = require('amqplib');
const { sendNotificationEmail } = require('./controllers/notificationController');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  console.log('Connected to RabbitMQ in Notification Service');

  const queues = [
    'inventory-out-of-stock',
    'inventory-updated',
    'inventory-decreased',
    'order-placed',
    'email-queue'
  ];

  for (let queue of queues) {
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        if (queue === 'inventory-out-of-stock') {
          await sendNotificationEmail(
            '🚫 Out of Stock Alert',
            `Product ${data.productId} is out of stock!`
          );
        }

        if (queue === 'inventory-updated') {
          await sendNotificationEmail(
            '📦 Inventory Updated',
            `Product ${data.productId} now has quantity: ${data.quantity}`
          );
        }

        if (queue === 'order-placed') {
          await sendNotificationEmail(
            '🛒 Order Placed',
            `New order placed for product ${data.productId}. Quantity: ${data.quantity}`
          );
        }

        if(queue === 'email-queue'){
          await sendNotificationEmail(
            data.subject || '📩 Message from Auth Service',
            data.body || 'Welcome!'
          );
        }
        channel.ack(msg);
      }
    });
  }
}

app.get('/', (req, res) => {
  res.send('Notification Service is up!');
});

app.listen(PORT, async () => {
  console.log(`Notification Service listening on port ${PORT}`);
  await connectRabbitMQ();
});

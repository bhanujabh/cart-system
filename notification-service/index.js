const express = require('express');
const dotenv = require('dotenv');
const amqp = require('amqplib');
const { sendNotificationEmail } = require('./controllers/notificationController');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;
const defaultEmail = process.env.DEFAULT_EMAIL || 'backup@example.com';

app.use('/api/notify', notificationRoutes);

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ in Notification Service');

    const queues = [
      'inventory-out-of-stock',
      'inventory-updated',
      'inventory-decreased',
      'order-placed',
      'email-queue',
    ];

    for (let queue of queues) {
      await channel.assertQueue(queue, { durable: true });

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString());
          const recipient = data.email || defaultEmail;

          try {
            switch (queue) {
              case 'inventory-out-of-stock':
                await sendNotificationEmail(
                  '🚫 Out of Stock Alert',
                  `Product ${data.productId} is out of stock!`,
                  recipient
                );
                break;

              case 'inventory-updated':
                await sendNotificationEmail(
                  '📦 Inventory Updated',
                  `Product ${data.productId} now has quantity: ${data.quantity}`,
                  recipient
                );
                break;

              case 'inventory-decreased':
                await sendNotificationEmail(
                  '📉 Inventory Decreased',
                  `Product ${data.productId} stock decreased. Remaining: ${data.quantity}`,
                  recipient
                );
                break;


              case 'order-placed':
                await sendNotificationEmail(
                  '🛒 Order Placed',
                  `New order placed for product ${data.productId}. Quantity: ${data.quantity}`,
                  recipient
                );
                break;

              case 'email-queue':
                await sendNotificationEmail(
                  data.subject || '📩 Message from Auth Service',
                  data.body || 'Welcome!',
                  data.to || defaultEmail
                );
                break;
            }

            channel.ack(msg); 
          } catch (err) {
            console.error(`Failed processing message from queue ${queue}:`, err);
          }
        }
      });
    }
  } catch (err) {
    console.error('Failed to connect to RabbitMQ:', err.message);
  }
}

app.get('/', (req, res) => {
  res.send('Notification Service is up!');
});

app.listen(PORT, async () => {
  console.log(`Notification Service listening on port ${PORT}`);
  await connectRabbitMQ();
});

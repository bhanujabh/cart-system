require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/inventoryDB');
const { connectRabbitMQ } = require('../shared/rabbitmq');
const Inventory = require('./models/inventory');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api/inventory', inventoryRoutes);

app.get('/inventory-service', (req, res) => {
  res.send('Inventory service is running');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, async () => {
  console.log(`Inventory service is listening on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.sync();
    await setupRabbitMQ();
  } catch (error) {
    console.error('Startup error:', error);
  }
});

async function setupRabbitMQ() {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ in Inventory Service');

    await channel.assertQueue('product-created', { durable: true });
    await channel.assertQueue('product-price-updated', { durable: true });

    // Listener for product creation → initialize inventory
    channel.consume('product-created', async (msg) => {
      const { productId } = JSON.parse(msg.content.toString());

      try {
        await Inventory.create({ productId, quantity: 0 });
        console.log(`Initialized inventory for product ${productId}`);
        channel.ack(msg);
      } catch (err) {
        console.error(`Failed to initialize inventory:`, err);
      }
    });

    // Listener for price update (optional for logging)
    channel.consume('product-price-updated', async (msg) => {
      const { productId, newPrice } = JSON.parse(msg.content.toString());

      console.log(`Product ${productId} price updated to ₹${newPrice}`);
      // You can ignore this or log it for auditing
      channel.ack(msg);
    });

  } catch (err) {
    console.error('Failed to connect/setup RabbitMQ:', err);
  }
}

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/shippingDB');
const { connectRabbitMQ, sendToQueue } = require('../shared/rabbitmq');
const shippingRoutes = require('./routes/shippingRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api/shipping', shippingRoutes);

app.get('/shipping-service', (req, res)=>{
    res.send('Shipping service is running');
});

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

let queueName = 'shipment-updated';

PORT = process.env.PORT || 3006;
app.listen(PORT, async ()=>{
    console.log(`Cart service is listening on port ${PORT}`);
    
    try{
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
        await connectRabbitMQ(queueName);
    } catch(error){
        console.log('Startup error: ', error);
    }
});
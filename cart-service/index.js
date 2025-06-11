require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/db');
const cartRoutes = require('./routes/cartRoutes');
const { connectRabbitMQ, sendToQueue } = require('../shared/rabbitmq');

const app = express();
app.use(bodyParser.json());
app.use('/api/cart', cartRoutes);

app.get('/cart-service', (req, res) =>{
    res.send('Cart service is running');
});

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

let queueName = 'product-availability';

const PORT = process.env.PORT || 3001;
app.listen(PORT, async()=>{
    console.log(`Cart service is listening on ${PORT}`);

    try{
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
        await connectRabbitMQ(queueName);
    } catch(error){
        console.log('Startup error: ', error);
    }
});
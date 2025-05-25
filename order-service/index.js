require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('../order-service/config/orderDB');
const orderRoutes = require('./routes/orderRoutes');
const { connectRabbitMQ, sendToQueue } = require('../shared/rabbitmq');

const app = express();
app.use(bodyParser.json());
app.use('/api/order', orderRoutes);

app.get('/order-service', (req, res) =>{
    res.send('Order service is running');
});

let queueName = 'order-created';

const PORT = process.env.PORT || 3002;
app.listen(PORT, async()=>{
    console.log(`Order service is listening on ${PORT}`);

    try{
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
        await connectRabbitMQ(queueName);
    } catch(error){
        console.log('Startup error: ', error);
    }
})

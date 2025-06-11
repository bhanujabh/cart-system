require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/inventoryDB');
const { connectRabbitMQ, sendToQueue } = require('../shared/rabbitmq');
const inventoryRoutes = require('./routes/inventoryRoutes')

const app = express();
app.use(bodyParser.json());
app.use('/api/inventory', inventoryRoutes);

app.get('/inventory-service', (req, res)=>{
    res.send('Inventory service is running');
});

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

let queueName = 'inventory-updated';

PORT = process.env.PORT || 3003;
app.listen(PORT, async ()=>{
    console.log(`Inventory service is listening on port ${PORT}`);
    
    try{
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
        await connectRabbitMQ(queueName);
    } catch(error){
        console.log('Startup error: ', error);
    }
});
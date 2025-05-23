require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/db');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send('Cart service is running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async()=>{
    console.log(`Cart service is listening on ${PORT}`);

    try{
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
    } catch(error){
        console.log('DB connection failed: ', error);
    }
});
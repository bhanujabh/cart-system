const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { connectRabbitMQ } = require('../shared/rabbitmq');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/auth-service', (req, res) =>{
    res.send('Authentication service is running');
});

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const PORT = process.env.PORT || 3005;

app.listen(PORT, async () => {
  console.log(`Auth service running on port ${PORT}`);
  try {
    await sequelize.sync({ alter: true });
    console.log('DB synced');
    await connectRabbitMQ();
  } catch (error) {
    console.error('Failed to connect DB:', error);
  }
});

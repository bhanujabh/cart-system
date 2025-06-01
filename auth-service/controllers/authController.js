const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const { sendToQueue } = require('../../shared/rabbitmq');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    sendToQueue('email_queue', {
      type: 'USER_REGISTERED',
      to: newUser.email,
      subject: 'Welcome to Our App!',
      body: `Hi there, thanks for signing up!`,
    });

    res.status(201).json({ message: 'User registered', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

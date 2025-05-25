const Order = require('../models/order');
const { sendToQueue } = require('../../shared/rabbitmq');

exports.createOrder = async (req, res) => {
    try{
        const order = await Order.create(req.body);
        sendToQueue('order-created', {
            email: req.body.email,
            message: `Order placed! ID: ${order.id}`,
        });
        res.status(201).json(order);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
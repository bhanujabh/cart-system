const Shipping = require('../models/shipping');
const { sendToQueue } =  require('../../shared/rabbitmq');

exports.createShipment = async (req, res) => {
  try {
    const { orderId, address } = req.body;
    if (!orderId || !address) {
      return res.status(400).json({ error: "Order ID and address are required." });
    }

    const shipment = await Shipping.create({
      orderId,
      address,
      status: 'pending'
    });

    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const shipment = await Shipping.findByPk(id);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    shipment.status = status;
    await shipment.save();

    await sendToQueue('shipment-updated', {
      orderId: req.body.orderId,
      status: 'shipped',
      email: 'user@example.com'
    });

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipping.findAll();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

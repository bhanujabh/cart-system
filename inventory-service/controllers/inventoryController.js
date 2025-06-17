const Inventory = require('../models/inventory');
const { sendToQueue } = require('../../shared/rabbitmq'); 

exports.upsertInventory = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let inventory = await Inventory.findOne({ where: { productId } });

    if (inventory) {
      inventory.quantity = quantity;
      await inventory.save();
    } else {
      inventory = await Inventory.create({ productId, quantity });
    }

    await sendToQueue('inventory-updated', { productId, quantity });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.decreaseInventory = async (req, res) => {
  try {
    const { productId, count } = req.body;
    const inventory = await Inventory.findOne({ where: { productId } });

    if (!inventory) return res.status(404).json({ error: 'Product not found' });

    if (inventory.quantity < count) {
      await sendToQueue('inventory-out-of-stock', { productId });
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    inventory.quantity -= count;
    await inventory.save();

    await sendToQueue('inventory-decreased', { productId, remaining: inventory.quantity });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ where: { productId } });

    if (!inventory) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

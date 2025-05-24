const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const { sendToQueue } = require('../../shared/rabbitmq');

exports.addToCart = async(req, res)=>{
    try{
        const { userId, productId, quantity, price } = req.body;
        let cart = await Cart.findOne({ where: { userId } });
        if(!cart) cart = await Cart.create({ userId });

        const item = await CartItem.create({ CartId: cart.id, productId, quantity, price });
        res.status(201).json({ message: 'Item added to cart', item});
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to add item' });
    }
};

exports.getCart = async(req, res)=>{
    try{
        const { userId } = req.params;
        let cart = await Cart.findOne({
            where: { userId },
            include: CartItem,
        });
        if(!cart) return res.status(400).json({ error: 'Cart not found' });
        res.json(cart);
    } catch(error){
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
}

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartItem.destroy({ where: { id: itemId } });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.requestNotification = async (req, res) => {
  const { userId, productId, email } = req.body;

  try {
    sendToQueue('product-availability', { userId, productId, email });
    res.status(200).json({ message: 'Notification request queued.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to queue notification.' });
  }
};
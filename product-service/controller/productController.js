const Product = require('../models/product');
const { sendToQueue } = require('../../shared/rabbitmq');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Add product with validation
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Name, price, and description are required' });
    }

    const product = await Product.create({ name, price, description });

    sendToQueue('product-created', {
      productId: product.id,
      name,
      price,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product price with validation
exports.updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ error: 'Price is required' });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.price = price;
    await product.save();

    sendToQueue('product-price-updated', {
      productId: product.id,
      newPrice: price,
    });

    res.json({ message: 'Product price updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update price' });
  }
};

// ✅ NEW: Delete product method
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();

    sendToQueue('product-deleted', {
      productId: id,
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

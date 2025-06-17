const { DataTypes } = require('sequelize');
const sequelize = require('../config/productDB');

const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING
  }
});

module.exports = Product;

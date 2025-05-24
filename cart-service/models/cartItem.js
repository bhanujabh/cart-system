const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Cart = require('./cart');

const CartItem = sequelize.define('CartItem', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

module.exports = CartItem;
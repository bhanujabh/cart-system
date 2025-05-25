const { DataTypes } = require('sequelize');
const sequelize = require('../config/inventoryDB');

const Inventory = sequelize.define('Inventory', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Inventory;

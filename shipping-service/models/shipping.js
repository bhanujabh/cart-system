const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/shippingDB');

const Shipping = sequelize.define('Shipping', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    trackingId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Shipping;
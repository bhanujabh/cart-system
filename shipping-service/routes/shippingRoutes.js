const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/', shippingController.createShipment);
router.patch('/:id', shippingController.updateShipmentStatus);
router.get('/', shippingController.getAllShipments);

module.exports = router;
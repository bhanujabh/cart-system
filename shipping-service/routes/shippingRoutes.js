const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/', shippingController.createShipment);
router.put('/:id/status', shippingController.updateShipmentStatus);
router.get('/', shippingController.getAllShipments);

module.exports = router;
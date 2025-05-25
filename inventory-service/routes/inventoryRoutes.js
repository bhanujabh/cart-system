const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/upsert', inventoryController.upsertInventory);
router.post('/decrease', inventoryController.decreaseInventory);
router.get('/:productId', inventoryController.getInventory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../db/products');

// get all products
// /api/products
router.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

module.exports = router;

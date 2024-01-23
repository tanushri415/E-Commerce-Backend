const express = require('express');
const router = express.Router();
const { getProductCategories, getAllProducts, getProductsOfSpecificCategory, getProductById } = require('../db/products');

// get all products
// /api/products
router.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

// /api/products/categories
router.get('/categories', async (req, res) => {
  const categories = await getProductCategories();
  res.send(categories);
});

// /api/products/:productId
router.get('/:productId', async (req, res) => {
  console.log(req.params.productId);
  const product = await getProductById(req.params.productId);
  res.send(product);
});

// /api/products/categories/:category
router.get('/category/:category', async (req, res) => {
  const products = await getProductsOfSpecificCategory(req.params.category);
  res.send(products);
});
module.exports = router;

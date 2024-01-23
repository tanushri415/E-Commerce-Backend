const client = require('./client');
const logger = require('./../logger');
// create a product in DB
async function createProduct({
  title,
  price,
  description,
  category,
  image,
  rating,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `INSERT INTO products(title, description, category, price, image, rating)
	        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, category, price, image, rating`,
      [title, description, category, price, image, rating]
    );
    return product;
  } catch (error) {
    logger.error(error);
  }
}

//get all products
async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
        SELECT * FROM products`);
    return products;
  } catch (error) {
    logger.error(error);
  }
}

//get all product categories
async function getProductCategories() {
  try {
    const { rows } = await client.query(`
        SELECT ARRAY(SELECT distinct category FROM products  order by category);`);
    return rows[0].array;
  } catch (error) {
    logger.error(error);
  }
}

async function getProductsOfSpecificCategory(category) {
  try {
    const { rows: products } = await client.query(`
        SELECT * FROM products WHERE category=$1`, [category]);

    return products;
  } catch (error) {
    logger.error(error);
  }
}

async function getProductById(productId) {
  try {
    const { rows: [product] } = await client.query(`
        SELECT * FROM products WHERE id=$1`, [productId]);

    return product;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { createProduct, getAllProducts, getProductCategories, getProductsOfSpecificCategory, getProductById };

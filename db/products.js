const client = require('./client');

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
    throw error;
  }
}

//get all products
async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
        SELECT * FROM products`);
    return products;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { createProduct, getAllProducts };

import pool from "../config/db.js";

export async function createProductTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function insertProduct(productData) {
  const { name, description, price, stock, image_url, category } = productData;
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, image_url, category)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, price, stock, image_url, category],
  );
  return result.rows[0];
}

export async function getAllProducts() {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY created_at DESC",
  );
  return result.rows;
}

export async function getProductById(productId) {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [productId],
  );
  return result.rows[0];
}

export async function updateProductById(productId, productData) {
  const { name, description, price, stock, image_url, category } = productData;
  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         stock = $4,
         image_url = $5,
         category = $6
     WHERE id = $7
     RETURNING *`,
    [name, description, price, stock, image_url, category, productId],
  );

  return result.rows[0];
}
export async function deleteProductById(productId) {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [productId],
  );
  return result.rows[0];
}


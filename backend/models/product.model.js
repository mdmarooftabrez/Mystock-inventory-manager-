import pool from "../config/db.js";

export async function createProductTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `);
  await pool.query(`
    UPDATE products
    SET user_id = (SELECT id FROM users ORDER BY id ASC LIMIT 1)
    WHERE user_id IS NULL
      AND EXISTS (SELECT 1 FROM users)
  `);
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM products WHERE user_id IS NULL) THEN
        ALTER TABLE products ALTER COLUMN user_id SET NOT NULL;
      END IF;
    END;
    $$
  `);
  await pool.query(
    "CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id)",
  );
}

export async function insertProduct(userId, productData) {
  const { name, description, price, stock, image_url, category } = productData;
  const result = await pool.query(
    `INSERT INTO products (user_id, name, description, price, stock, image_url, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, name, description, price, stock, image_url, category],
  );
  return result.rows[0];
}

export async function getAllProducts(userId) {
  const result = await pool.query(
    "SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

export async function getProductById(userId, productId) {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1 AND user_id = $2",
    [productId, userId],
  );
  return result.rows[0];
}

export async function updateProductById(userId, productId, productData) {
  const { name, description, price, stock, image_url, category } = productData;
  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         stock = $4,
         image_url = $5,
         category = $6
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [name, description, price, stock, image_url, category, productId, userId],
  );

  return result.rows[0];
}
export async function deleteProductById(userId, productId) {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *",
    [productId, userId],
  );
  return result.rows[0];
}

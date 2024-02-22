import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
});

export async function createDatabaseAndTable() {
  try {
    const connection = await pool.getConnection();

    // Create the database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "bitespeed"}`
    );

    // Switch to the specified database
    await connection.query(`USE ${process.env.DB_NAME || "bitespeed"}`);

    // Create the table if it doesn't exist
    await connection.query(`
    CREATE TABLE IF NOT EXISTS contact (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      phoneNumber VARCHAR(16) DEFAULT NULL,
      email VARCHAR(25) DEFAULT NULL,
      linkedId INT DEFAULT NULL,
      linkPrecedence ENUM('PRIMARY','SECONDARY') NOT NULL DEFAULT 'PRIMARY',
      createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL DEFAULT NULL,
      PRIMARY KEY (id)
    );`);

    console.log("DB initialized...");

    connection.release();
  } catch (err) {
    console.error("Error creating database and table:", err);
  }
}

export default pool;

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

// Get customers from PostgreSQL
app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("PostgreSQL error:", error);

    res.status(500).json({
      error: "Could not fetch customers",
    });
  }
});

// Get products from PostgreSQL
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY price DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("PostgreSQL error:", error);

    res.status(500).json({
      error: "Could not fetch products",
    });
  }
});

// Get statistics from PostgreSQL
app.get("/api/sales", async (req, res) => {
  try {
    const revenue = await pool.query(
      "SELECT\
      SUM(revenue) AS total_sales\
      FROM sales\
      WHERE status = 'completed'\
      "
    );

    const top_revenue_product = await pool.query(
      "SELECT\
        p.product_name AS p_name\
      FROM sales s\
      JOIN products p\
      ON p.product_id = s.product_id\
      GROUP BY p.product_id, p.product_name\
      ORDER BY SUM(s.revenue) DESC\
      LIMIT 1\
      "
    );

    const top_quantity_product = await pool.query(
      "SELECT\
        p.product_name AS p_name\
      FROM sales s\
      JOIN products p\
      ON p.product_id = s.product_id\
      GROUP BY p.product_id, p.product_name\
      ORDER BY SUM(s.quantity) DESC\
      LIMIT 1\
      "
    );

    const yearly_revenue = await pool.query(
      "SELECT\
        EXTRACT(YEAR FROM order_date)::int AS year, SUM(revenue) AS yearly_revenue\
      FROM sales\
      GROUP BY EXTRACT(YEAR FROM order_date)\
      ORDER BY year ASC\
      "
    );

    res.json({totalSales:Number(revenue.rows[0].total_sales),
              yearlySales:yearly_revenue.rows,
              topRevProduct:top_revenue_product.rows[0].p_name,
              topQuaProduct:top_quantity_product.rows[0].p_name
    });
  } catch (error) {
    console.error("PostgreSQL error:", error);

    res.status(500).json({
      error: "Could not fetch statistics",
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});


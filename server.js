const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// POST route to CREATE a new customer
app.post("/api/customers", async (req, res) => {
  try {
    const { name, year, make, model } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customer (name, year, make, model) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, year, make, model]
    );
    res.json(newCustomer.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// GET route to READ all customers
app.get("/api/customers", async (req, res) => {
  try {
    const allCustomers = await pool.query("SELECT * FROM customer");
    res.json(allCustomers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// GET route to READ a customer
app.get("/api/customers/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const customer = await pool.query(
      "SELECT * FROM customer WHERE name = $1",
      [name]
    );
    console.log(res.json(customer.rows[0]));
    res.json(customer.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// PUT route to UPDATE a customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { make } = req.body;
    const updateCustomer = await pool.query(
      "UPDATE customer SET make = $1 WHERE id = $2",
      [make, id]
    );
    res.json("customer was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE route to DELETE a customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCustomer = await pool.query(
      "DELETE FROM customer WHERE id = $1",
      [id]
    );
    req.json(id, " was deleted");
  } catch (err) {
    console.error(err.message);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

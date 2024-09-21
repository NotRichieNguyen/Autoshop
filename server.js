const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//auth
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const secretKey = "your_jwt_secret_key"; // Use a strong secret key and store it securely

// Hardcoded credentials (replace the password hash with the actual hash)
const hardcodedUser = {
  username: "admin",
  password: "$2a$10$nICCwS.4vVcgqnEhPD1Kdes4DWhrViZQvPjC3KjRuRCOtuRXa7NIa", // bcrypt hash for "password"
};

// User loginad
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== hardcodedUser.username) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, hardcodedUser.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ username: hardcodedUser.username }, secretKey, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// middleware
app.use(cors());
app.use(express.json());

// POST route to CREATE a new customer
app.post("/api/customers", async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      yearmakemodel,
      vin,
      license,
      color,
      mil,
      tech,
      service_date,
    } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO vehicle (name, address, phone, yearmakemodel, vin, license, color, mil, tech, service_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        name,
        address,
        phone,
        yearmakemodel,
        vin,
        license,
        color,
        mil,
        tech,
        service_date,
      ]
    );
    res.json(newCustomer.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// POST route to CREATE a new service for an existing vehicle
app.post("/api/services", async (req, res) => {
  try {
    const { description, parts, labor, vehicle_id } = req.body;

    // Validate input fields
    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Invalid or missing description" });
    }
    if (isNaN(parts) || parts < 0) {
      return res.status(400).json({ error: "Invalid or missing parts cost" });
    }
    if (isNaN(labor) || labor < 0) {
      return res.status(400).json({ error: "Invalid or missing labor cost" });
    }
    if (!vehicle_id || isNaN(vehicle_id)) {
      return res.status(400).json({ error: "Invalid or missing vehicle_id" });
    }

    // Check if the vehicle_id exists in the database
    const vehicleExists = await pool.query(
      "SELECT id FROM vehicle WHERE id = $1",
      [vehicle_id]
    );
    if (vehicleExists.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Insert new service into the service table
    const newService = await pool.query(
      "INSERT INTO service (description, parts, labor, vehicle_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [description, parts, labor, vehicle_id]
    );

    res.json(newService.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET route to READ all customers by Ascending Order
app.get("/api/customers", async (req, res) => {
  try {
    const allCustomers = await pool.query(
      "SELECT * FROM vehicle ORDER BY service_date DESC"
    );
    res.json(allCustomers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// GET route to READ all services
app.get("/api/services", async (req, res) => {
  try {
    const services = await pool.query("SELECT * FROM service");
    res.json(services.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// NEW GET route to READ a customer by name
app.get("/api/customers/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const customer = await pool.query("SELECT * FROM vehicle WHERE name = $1", [
      name,
    ]);
    if (customer.rows.length > 0) {
      res.json(customer.rows[0]);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// GET route to READ services for a specific vehicle
app.get("/api/vehicles/:vehicleId/services", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const services = await pool.query(
      "SELECT * FROM service WHERE vehicle_id = $1",
      [vehicleId]
    );
    res.json(services.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// UPDATE customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phone,
      yearmakemodel,
      vin,
      license,
      color,
      mil,
      tech,
      service_date,
    } = req.body;

    const updateCustomer = await pool.query(
      "UPDATE vehicle SET name = $1, address = $2, phone = $3, yearmakemodel = $4, vin = $5, license = $6, color = $7, mil = $8, tech = $9, service_date = $10 WHERE id = $11",
      [
        name,
        address,
        phone,
        yearmakemodel,
        vin,
        license,
        color,
        mil,
        tech,
        service_date,
        id,
      ]
    );

    res.json("Customer information was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE route to DELETE a customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCustomer = await pool.query(
      "DELETE FROM vehicle WHERE id = $1",
      [id]
    );
    req.json(id, " was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE route to delete a specific service by its ID
app.delete("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteService = await pool.query(
      "DELETE FROM service WHERE id = $1",
      [id]
    );
    req.json(id, " was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

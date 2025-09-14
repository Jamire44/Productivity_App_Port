import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid token" });
  }
}

// Health check
app.get("/ping", (req, res) => res.json({ message: "pong" }));
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// ✅ Get all tasks for the logged-in user
app.get("/tasks", authenticateToken, async (req, res) => {
  const userId = req.user.sub; // UUID from JWT
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new task
app.post("/tasks", authenticateToken, async (req, res) => {
  const userId = req.user.sub;
  const { title } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *",
      [userId, title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Toggle completion
app.put("/tasks/:id/toggle", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Auth header:", authHeader);
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

// Quick check
app.get("/", (req, res) => res.send("Backend is running "));

// Get all tasks for the logged in user
app.get("/tasks", authenticateToken, async (req, res) => {

  // UUID from JWT
  const userId = req.user.sub; 
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

// Add a new task
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

// Toggle to complete
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

// Delete account using Supabase Admin client
app.delete("/account", authenticateToken, async (req, res) => {
  const userId = req.user.sub;

  try {
    // Delete user’s tasks
    await pool.query("DELETE FROM tasks WHERE user_id = $1", [userId]);

    // Delete user from Supabase auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Supabase Admin delete error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error deleting account" });
  }
});


// Get all notes
app.get("/notes", authenticateToken, async (req, res) => {
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a note
app.post("/notes", authenticateToken, async (req, res) => {
  const userId = req.user.sub;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note
app.put("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2, updated_at = now() WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content, id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note
app.delete("/notes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events
app.get("/calendar", authenticateToken, async (req, res) => {
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "SELECT * FROM calendar_events WHERE user_id = $1 ORDER BY event_date ASC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add event
app.post("/calendar", authenticateToken, async (req, res) => {
  const userId = req.user.sub;
  const { title, description, event_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO calendar_events (user_id, title, description, event_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, description, event_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
app.put("/calendar/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  const { title, description, event_date } = req.body;
  try {
    const result = await pool.query(
      "UPDATE calendar_events SET title=$1, description=$2, event_date=$3, updated_at=now() WHERE id=$4 AND user_id=$5 RETURNING *",
      [title, description, event_date, id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
app.delete("/calendar/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  try {
    const result = await pool.query(
      "DELETE FROM calendar_events WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics summary
app.get("/analytics", authenticateToken, async (req, res) => {
  const userId = req.user.sub;

  try {
    const [taskStats, noteStats, eventStats] = await Promise.all([
      pool.query(
        "SELECT COUNT(*) FILTER (WHERE completed = true) AS completed, COUNT(*) FILTER (WHERE completed = false) AS pending FROM tasks WHERE user_id = $1",
        [userId]
      ),
      pool.query(
        "SELECT COUNT(*) AS total_notes FROM notes WHERE user_id = $1",
        [userId]
      ),
      pool.query(
        "SELECT COUNT(*) FILTER (WHERE event_date >= CURRENT_DATE) AS upcoming, COUNT(*) FILTER (WHERE event_date < CURRENT_DATE) AS past FROM calendar_events WHERE user_id = $1",
        [userId]
      ),
    ]);

    res.json({
      tasks: taskStats.rows[0],
      notes: noteStats.rows[0],
      events: eventStats.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.use((req, res) => {
  console.log("Unhandled route:", req.method, req.url);
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

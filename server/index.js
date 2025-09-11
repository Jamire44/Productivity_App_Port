import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server running!"));

app.get("/ping", (req, res) => {res.json({ message: "pong" })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  
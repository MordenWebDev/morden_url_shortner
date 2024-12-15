import express from "express";
import connectDB from "./config/db.js"; // Importing DB connection
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import cors from "cors";
const app = express();
const PORT = 3000;

connectDB();
app.use(express.json());
// Configure CORS
app.use(cors({
  origin: ["http://localhost:5173"], // Replace with your frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use("/auth", authRoutes);
app.use("/url", urlRoutes);
app.use("/password", passwordRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

import express from "express";
import connectDB from './config/db.js'; // Importing DB connection
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';

const app = express();
const PORT = 3000;

connectDB();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/url", urlRoutes);
app.use("/password", passwordRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

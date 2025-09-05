import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'


import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;


//middleware
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use (express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(rateLimiter);


const startServer = async () => {
  await connectDB();

  app.use("/api/notes", notesRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);


  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();


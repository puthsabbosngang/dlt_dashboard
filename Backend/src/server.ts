import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db"; 
import authRoutes from "./routes/authRoutes"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

db.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");

    app.use("/api/auth", authRoutes);

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

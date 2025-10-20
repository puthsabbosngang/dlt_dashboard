// import express, { Request, Response } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { db } from "./config/db"; 
// import authRoutes from "./routes/authRoutes"; 
// import userRoutes from "./routes/userRoutes";
// import { authenticateToken } from "./midleware/authToken";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// db.initialize()
//   .then(() => {
//     console.log("✅ Database connected successfully");

//     app.use("/api/auth", authRoutes);
//     app.get("/api/auth/me", authenticateToken, (req, res) => {
//       res.json({ user: req.user });
//     });

//     app.use("/api/users", userRoutes);
//     app.listen(PORT, () =>
//       console.log(`🚀 Server running at http://localhost:${PORT}`)
//     );
//   })
//   .catch((err) => {
//     console.error("❌ Database connection error:", err);
//   });

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { authenticateToken } from "./midleware/authToken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.get("/api/auth/me", authenticateToken, (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});
app.use("/api/users", userRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("❌ Unhandled Error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Database initialization
db.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Gracefully shutting down...");
  await db.destroy();
  process.exit(0);
});


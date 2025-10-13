import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("✅ Express backend is running successfully!");
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

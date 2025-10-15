import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { User } from "../entities/User";
import { Staff } from "../entities/Staff";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// REGISTER 
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, confirmPassword, type, full_name, role, phone } = req.body;

    if (!username || !password || !confirmPassword || !type) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    if (confirmPassword !== password) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
      username,
      password: hashedPassword,
      type,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedUser = await userRepo.save(newUser);

    // if staff insert detail to staff table
    if (type === "staff") {
      const newStaff = staffRepo.create({
        full_name,
        role: role || "staff",
        phone,
        user_id: savedUser.id,
      });
      await staffRepo.save(newStaff);
    }

    res.status(201).json({
      id: savedUser.id,
      username: savedUser.username,
      type: savedUser.type,
      message: `${type} registered successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Missing username or password" });
      return;
    }

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { username } });

    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: user.id, type: user.type }, SECRET, { expiresIn: "1d" });

    let staff = null;
    if (user.type === "staff") {
      staff = await staffRepo.findOne({ where: { user_id: user.id } });
    }

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        type: user.type,
        staff,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

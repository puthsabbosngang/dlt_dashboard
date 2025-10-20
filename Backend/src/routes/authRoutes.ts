// import express, { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { db } from "../config/db";
// import { User } from "../entities/User";
// import { Staff } from "../entities/Staff";

// const router = express.Router();
// const SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// export const ERRORS = {
//   MISSING_FIELDS: "Missing required fields",
//   INVALID_CREDENTIALS: "Invalid username or password",
//   INVALID_CONFIRMPASSWORD: "Confirm password do not match",
//   USER_EXISTS: "Username already exists",
//   USER_NOT_FOUND: "User not found",
// };



// // REGISTER 
// router.post("/register", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username, password, confirmPassword, type, full_name, role, phone } = req.body;

//     if (!username || !password || !confirmPassword || !type) {
//       res.status(400).json({ message: ERRORS.MISSING_FIELDS});
//       return;
//     }

//     if (confirmPassword !== password) {
//       res.status(400).json({ message: ERRORS.INVALID_CONFIRMPASSWORD });
//       return;
//     }

//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     const existingUser = await userRepo.findOne({ where: { username } });
//     if (existingUser) {
//       res.status(400).json({ message: ERRORS.USER_EXISTS });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = userRepo.create({
//       username,
//       password: hashedPassword,
//       type,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     const savedUser = await userRepo.save(newUser);

//     // if staff insert detail to staff table
//     if (type === "staff") {
//       const newStaff = staffRepo.create({
//         full_name,
//         role: role || "staff",
//         phone,
//         user_id: savedUser.id,
//       });
//       await staffRepo.save(newStaff);
//     }

//     res.status(201).json({
//       id: savedUser.id,
//       username: savedUser.username,
//       type: savedUser.type,
//       message: `${type} registered successfully`,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // LOGIN
// router.post("/login", async (req: Request, res: Response): Promise<void> => {
//   try {
//     console.log("Login attempt:", req.body);
//     const { username, password } = req.body;

//     if (!username || !password) {
//       console.log("Missing username or password");
//       res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
//       return;
//     }

//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     console.log("Looking for user:", username);
//     const user = await userRepo.findOne({ where: { username } });

//     if (!user) {
//       console.log("User not found:", username);
//       res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
//       return;
//     }

//     console.log("User found:", user.username, "Type:", user.type);
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Password mismatch for user:", username);
//       res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
//       return;
//     }

//     const token = jwt.sign({ id: user.id, type: user.type }, SECRET, { expiresIn: "1d" });

//     let staff = null;
//     if (user.type === "staff") {
//       staff = await staffRepo.findOne({ where: { user_id: user.id } });
//       console.log("Staff data found:", staff ? "Yes" : "No");
//     }

//     const response = {
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         type: user.type,
//         staff,
//       },
//     };

//     console.log("Login successful for:", username);
//     res.json(response);
//   } catch (error: any) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { User } from "../entities/User";
import { Staff } from "../entities/Staff";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const ERRORS = {
  MISSING_FIELDS: "Missing required fields",
  INVALID_CREDENTIALS: "Invalid username or password",
  INVALID_CONFIRMPASSWORD: "Confirm password does not match",
  USER_EXISTS: "Username already exists",
  USER_NOT_FOUND: "User not found",
};

// ======================= REGISTER =======================
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      password,
      confirmPassword,
      type,
      full_name,
      role,
      phone,
    } = req.body;

    if (!username || !password || !confirmPassword || !type) {
      res.status(400).json({ message: ERRORS.MISSING_FIELDS });
      return;
    }

    if (confirmPassword !== password) {
      res.status(400).json({ message: ERRORS.INVALID_CONFIRMPASSWORD });
      return;
    }

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: ERRORS.USER_EXISTS });
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

    // If user is staff, create staff record
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
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: ERRORS.MISSING_FIELDS });
      return;
    }

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) {
      res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
      return;
    }

    // ✅ JWT should only contain essential fields
    const token = jwt.sign(
      { id: user.id, username: user.username, type: user.type },
      SECRET,
      { expiresIn: "1d" }
    );

    // Include staff info if applicable
    let staff = null;
    if (user.type === "staff") {
      staff = await staffRepo.findOne({ where: { user_id: user.id } });
    }

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        type: user.type,
        staff,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

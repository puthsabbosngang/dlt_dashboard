// import express, { Request, Response } from "express";
// import { db } from "../config/db";
// import { User } from "../entities/User";
// import { Staff } from "../entities/Staff";

// const router = express.Router();

// router.get("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { type } = req.query;
//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     if (type === "staff") {
//       const staffs = await staffRepo
//         .createQueryBuilder("staff")
//         .leftJoinAndSelect("staff.user", "user")
//         .select([
//           "staff.id",
//           "staff.full_name",
//           "staff.role",
//           "staff.phone",
//           "user.id",
//           "user.username",
//           "user.type",
//           "user.created_at",
//         ])
//         .getMany();
//       res.json(staffs);
//       return;
//     }

//     const customers = await userRepo.find({
//       where: { type: "customer" },
//       select: ["id", "username", "type", "created_at", "updated_at"],
//     });

//     res.json(customers);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /** GET SINGLE USER BY ID */
// router.get("/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     const user = await userRepo.findOne({ where: { id: Number(id) } });

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     let staff = null;
//     if (user.type === "staff") {
//       staff = await staffRepo.findOne({ where: { user_id: user.id } });
//     }

//     res.json({ ...user, staff });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /** ADD NEW USER */
// router.post("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username, password, type, full_name, role, phone } = req.body;

//     if (!username || !password || !type) {
//       res.status(400).json({ message: "Missing required fields" });
//       return;
//     }

//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     const existingUser = await userRepo.findOne({ where: { username } });
//     if (existingUser) {
//       res.status(400).json({ message: "Username already exists" });
//       return;
//     }

//     const newUser = userRepo.create({
//       username,
//       password,
//       type,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     const savedUser = await userRepo.save(newUser);

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
//       message: `${type} user created successfully`,
//       user: savedUser,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /** UPDATE USER */
// router.put("/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { username, type, full_name, role, phone } = req.body;

//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     const user = await userRepo.findOne({ where: { id: Number(id) } });

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     user.username = username || user.username;
//     user.type = type || user.type;
//     user.updated_at = new Date();

//     const updatedUser = await userRepo.save(user);

//     // Update staff details if user is staff
//     if (user.type === "staff") {
//       let staff = await staffRepo.findOne({ where: { user_id: user.id } });

//       if (!staff) {
//         staff = staffRepo.create({
//           full_name,
//           role,
//           phone,
//           user_id: user.id,
//         });
//       } else {
//         staff.full_name = full_name || staff.full_name;
//         staff.role = role || staff.role;
//         staff.phone = phone || staff.phone;
//       }

//       await staffRepo.save(staff);
//     }

//     res.json({ message: "User updated successfully", user: updatedUser });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /** DELETE USER*/
// router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userRepo = db.getRepository(User);
//     const staffRepo = db.getRepository(Staff);

//     const user = await userRepo.findOne({ where: { id: Number(id) } });
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     if (user.type === "staff") {
//       await staffRepo.delete({ user_id: user.id });
//     }

//     await userRepo.delete({ id: user.id });
//     res.json({ message: "User deleted successfully" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";
import { User } from "../entities/User";
import { Staff } from "../entities/Staff";
import { authenticateToken } from "../midleware/authToken"; // optional if you want protected routes

const router = express.Router();

/**
 * GET ALL USERS (staff or customer)
 * Query param: ?type=staff or ?type=customer
 */
router.get("/", /*authenticateToken,*/ async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    if (type === "staff") {
      const staffs = await staffRepo
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.user", "user")
        .select([
          "staff.id",
          "staff.full_name",
          "staff.role",
          "staff.phone",
          "user.id",
          "user.username",
          "user.type",
          "user.created_at",
        ])
        .orderBy("staff.id", "ASC")
        .getMany();

      res.json(staffs);
      return;
    }

    // default to customer if type not specified
    const customers = await userRepo.find({
      where: { type: "customer" },
      select: ["id", "username", "type", "created_at", "updated_at"],
      order: { id: "ASC" },
    });

    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * GET SINGLE USER BY ID
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let staff = null;
    if (user.type === "staff") {
      staff = await staffRepo.findOne({ where: { user_id: user.id } });
    }

    res.json({ ...user, staff });
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
});

/**
 * CREATE NEW USER (Customer or Staff)
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, type, full_name, role, phone } = req.body;

    if (!username || !password || !type) {
      res.status(400).json({ message: "Missing required fields" });
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
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedUser = await userRepo.save(newUser);

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
      message: `${type} created successfully`,
      user: savedUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

/**
 * UPDATE USER (Customer or Staff)
 */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, type, full_name, role, phone, status } = req.body;

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.username = username || user.username;
    user.type = type || user.type;
    user.status = status || user.status;
    user.updated_at = new Date();

    const updatedUser = await userRepo.save(user);

    if (user.type === "staff") {
      let staff = await staffRepo.findOne({ where: { user_id: user.id } });
      if (!staff) {
        staff = staffRepo.create({ full_name, role, phone, user_id: user.id });
      } else {
        staff.full_name = full_name || staff.full_name;
        staff.role = role || staff.role;
        staff.phone = phone || staff.phone;
      }
      await staffRepo.save(staff);
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

/**
 * DELETE USER (Customer or Staff)
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.type === "staff") {
      await staffRepo.delete({ user_id: user.id });
    }

    await userRepo.delete({ id: user.id });

    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default router;

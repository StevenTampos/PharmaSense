import { Router } from "express";
import { getUsers, createUser, updateUserStatus } from "../controllers/userController.ts";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.ts";

const router = Router();

// All user management routes require authentication and Administrator role
router.use(authenticateToken, requireAdmin);

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id/status", updateUserStatus);

export default router;

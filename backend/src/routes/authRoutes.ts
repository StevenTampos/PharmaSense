import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { authLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.post("/login", authLimiter, login);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, getMe);

export default router;

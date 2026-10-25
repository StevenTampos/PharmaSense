import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { apiLimiter, authLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

router.post("/login", authLimiter, login);
router.post("/logout", apiLimiter, authenticateToken, logout);
router.get("/me", apiLimiter, authenticateToken, getMe);

export default router;

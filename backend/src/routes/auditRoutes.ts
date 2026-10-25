import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.ts";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.ts";
import { apiLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

// Only Administrator may review and search audit logs (REQ-4.9-3, REQ-5.5-1)
router.use(apiLimiter, authenticateToken, requireAdmin);

router.get("/", getAuditLogs);

export default router;

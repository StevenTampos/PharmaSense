import express, { type Application, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { config } from "./config/environment.ts";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import auditRoutes from "./routes/auditRoutes.ts";

export const app: Application = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "PharmaSense backend API is operational.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-logs", auditRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "API route not found.",
  });
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  void next;
  console.error("Unhandled API error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

export default app;

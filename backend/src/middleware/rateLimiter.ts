import rateLimit from "express-rate-limit";

const isTestEnvironment = process.env.NODE_ENV === "test";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnvironment,
  message: {
    status: "error",
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnvironment,
  message: {
    status: "error",
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

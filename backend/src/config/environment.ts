import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || "pharmasense",
    user: process.env.DB_USER || "pharmasense_user",
    password: process.env.DB_PASSWORD || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "pharmasense_jwt_dev_secret_key_change_in_production",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },
};

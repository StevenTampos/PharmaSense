-- Create users table for authentication and role-based account management in Sprint 1.

CREATE TABLE users (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  role           ENUM('Administrator', 'Cashier/Pharmacist', 'Inventory Manager') NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  profile_pic    VARCHAR(255) DEFAULT NULL,
  status         ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

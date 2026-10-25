-- Seed synthetic user accounts for local development and unit testing in Sprint 1.
-- WARNING: Development-only accounts with known passwords. Never use in production.
--
-- Account Credentials (Dev Only):
-- 1. admin@pharmasense.local          | Role: Administrator      | Password: AdminPassword123!
-- 2. pharmacist@pharmasense.local     | Role: Cashier/Pharmacist | Password: PharmacistPassword123!
-- 3. inventory@pharmasense.local      | Role: Inventory Manager  | Password: InventoryPassword123!
-- 4. inactive.staff@pharmasense.local | Role: Cashier/Pharmacist | Password: InactivePassword123! (Inactive)

INSERT INTO users (
  first_name,
  last_name,
  email,
  phone,
  role,
  password_hash,
  profile_pic,
  status
) VALUES
(
  'Admin',
  'User',
  'admin@pharmasense.local',
  '09171234567',
  'Administrator',
  '$2b$12$DxJu5t82uKi1e30JOZm8JuKigfrhF99vwlXoEbba1.lJ5IuqthhY2',
  NULL,
  'Active'
),
(
  'Maria',
  'Santos',
  'pharmacist@pharmasense.local',
  '09181234567',
  'Cashier/Pharmacist',
  '$2b$12$Y6.HcN2V..bB1aauyzfNp.vWI35KI6.2nYrk68kaheCudRMSB9LW2',
  NULL,
  'Active'
),
(
  'Juan',
  'Dela Cruz',
  'inventory@pharmasense.local',
  '09191234567',
  'Inventory Manager',
  '$2b$12$XhbmaZxpwPdGIURqb22WsOqsNuEaUcD/1Sv25KYaJPduRdro2gKoS',
  NULL,
  'Active'
),
(
  'Alex',
  'Rivera',
  'inactive.staff@pharmasense.local',
  '09201234567',
  'Cashier/Pharmacist',
  '$2b$12$zgVssNDg0/t4vlmYtJI0k.3.k2iTB4FrZOCYr0gtn24TgWablHlAu',
  NULL,
  'Inactive'
);

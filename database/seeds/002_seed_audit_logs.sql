-- Seed synthetic audit log entries for local development and unit testing in Sprint 1.
-- Demonstrates user provisioning, successful and failed logins, and account deactivation.

INSERT INTO audit_logs (
  user_id,
  action,
  module,
  record_id,
  description,
  ip_address,
  device
) VALUES
(
  (SELECT id FROM users WHERE email = 'admin@pharmasense.local'),
  'CREATE_USER',
  'Account Management',
  CAST((SELECT id FROM users WHERE email = 'pharmacist@pharmasense.local') AS CHAR),
  'Administrator provisioned account for Maria Santos (pharmacist@pharmasense.local)',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
),
(
  (SELECT id FROM users WHERE email = 'admin@pharmasense.local'),
  'CREATE_USER',
  'Account Management',
  CAST((SELECT id FROM users WHERE email = 'inventory@pharmasense.local') AS CHAR),
  'Administrator provisioned account for Juan Dela Cruz (inventory@pharmasense.local)',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
),
(
  (SELECT id FROM users WHERE email = 'admin@pharmasense.local'),
  'DEACTIVATE_USER',
  'Account Management',
  CAST((SELECT id FROM users WHERE email = 'inactive.staff@pharmasense.local') AS CHAR),
  'Administrator deactivated account for Alex Rivera (inactive.staff@pharmasense.local)',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
),
(
  (SELECT id FROM users WHERE email = 'admin@pharmasense.local'),
  'LOGIN',
  'Authentication',
  CAST((SELECT id FROM users WHERE email = 'admin@pharmasense.local') AS CHAR),
  'User admin@pharmasense.local logged in successfully',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
),
(
  NULL,
  'LOGIN_FAILED',
  'Authentication',
  NULL,
  'Failed login attempt for unregistered email unregistered@example.com',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
),
(
  (SELECT id FROM users WHERE email = 'inactive.staff@pharmasense.local'),
  'LOGIN_BLOCKED',
  'Authentication',
  CAST((SELECT id FROM users WHERE email = 'inactive.staff@pharmasense.local') AS CHAR),
  'Login blocked for deactivated account inactive.staff@pharmasense.local',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'
);

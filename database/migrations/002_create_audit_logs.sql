-- Create audit_logs table to record authentication, account actions, and security events.

CREATE TABLE audit_logs (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED DEFAULT NULL,
  action       VARCHAR(50)  NOT NULL,
  module       VARCHAR(50)  NOT NULL,
  record_id    VARCHAR(100) DEFAULT NULL,
  description  VARCHAR(500) NOT NULL,
  ip_address   VARCHAR(45)  DEFAULT NULL,
  device       VARCHAR(255) DEFAULT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_audit_logs_user_id (user_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_module (module),
  INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

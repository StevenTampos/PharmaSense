const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks whether a string has a basic email address format.
 *
 * @param email - Value to validate.
 * @returns Whether the value matches the accepted email format.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

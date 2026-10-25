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

/**
 * Checks whether a required form value contains non-whitespace text.
 *
 * @param value - Value to validate.
 * @returns Whether the value is present.
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Checks whether a phone number contains digits only.
 *
 * @param phone - Phone number to validate.
 * @returns Whether the phone number contains only digits.
 */
export function isDigitsOnlyPhone(phone: string): boolean {
  return /^\d+$/.test(phone);
}

/**
 * Checks whether the password and confirmation match.
 *
 * @param password - Password value.
 * @param confirmation - Password confirmation value.
 * @returns Whether both values match.
 */
export function passwordsMatch(password: string, confirmation: string): boolean {
  return password === confirmation;
}

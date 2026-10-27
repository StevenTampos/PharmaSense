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
 * Checks whether an identifier is an accepted login value (email or "admin" test alias).
 *
 * @param identifier - Login value to validate.
 * @returns Whether the identifier is valid for login.
 */
export function isValidLoginIdentifier(identifier: string): boolean {
  const trimmed = identifier.trim().toLowerCase();
  return trimmed === "admin" || isValidEmail(trimmed);
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
 * Checks whether a phone number contains digits with optional common formatting.
 *
 * @param phone - Phone number to validate.
 * @returns Whether the trimmed phone number contains digits and common separators only.
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^[\d\s()+.-]+$/.test(phone.trim()) && /\d/.test(phone);
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

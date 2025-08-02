import { ErrorMap } from '../constants/errors';
import { Email, Name, Password } from '../constants/types';


export function isValidName(name: Name): string | boolean {
  if (name.length > 100) {
    return ErrorMap['NAME_TOO_LONG'];
  }

  if (name.length < 1) {
    return ErrorMap['NAME_TOO_SHORT'];
  }

  return true;
}

export function isValidEmail(
  email: Email,
  isRegister?: boolean
): string | boolean {
  if (email.length > 50) {
    return ErrorMap['EMAIL_TOO_LONG'];
  }

  if (email.length < 1) {
    return ErrorMap['EMAIL_TOO_SHORT'];
  }

  // Note: Email uniqueness now checked at the service level with Prisma
  // This helper now only validates format and length
  if (isRegister) {
    // Service layer will handle uniqueness validation with database
  }

  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (!pattern.test(email)) {
    return ErrorMap['EMAIL_SUFFIX'];
  }

  return true;
}

export function isValidPassword(password: Password): string | boolean {
  if (password.length < 6) {
    return ErrorMap['PASSWORD_LENGTH'];
  }

  const numPattern = /\d/;
  const upperPattern = /[A-Z]/;
  const lowerPattern = /[a-z]/;
  if (
    !numPattern.test(password) ||
    !upperPattern.test(password) ||
    !lowerPattern.test(password)
  ) {
    return ErrorMap['PASSWORD_SYMBOLS'];
  }

  return true;
}

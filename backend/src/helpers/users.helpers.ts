import { ErrorMap } from '../constants/errors';
import { Email, Name, Password } from '../constants/types';
import { getData } from '../dataStore';

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

  const users = getData().users;
  if (users.find((u) => u.email === email) && isRegister) {
    return ErrorMap['EMAIL_ALREADY_EXISTS'];
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

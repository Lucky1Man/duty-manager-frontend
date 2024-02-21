import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validatePassword(
  control: AbstractControl
): ValidationErrors | null {
  const password: string = control.value;

  if (!password) {
    return null;
  }

  let split: string[] = password.split('');

  if (
    !split.every(
      (ch) =>
        /[a-z]/.test(ch.toLowerCase()) ||
        /[0-9]/.test(ch) ||
        ch === '_' ||
        ch === '-' ||
        ch === '&'
    )
  ) {
    return {
      invalidPassword: 'Only english letters, numbers, _, & and -',
    };
  }
  return null;
}

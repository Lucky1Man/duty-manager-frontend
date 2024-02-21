import { FormGroup, ValidationErrors } from "@angular/forms";

export function getErrorMessage(formControlName: string, form : FormGroup): string {
    const formControl = form.get(formControlName);
    if (formControl?.hasError('required')) {
      return 'This field is required';
    } else if (formControl?.hasError('email')) {
      return 'Invalid email';
    } else if (formControl?.hasError('minlength')) {
      return 'Password should be at least 8 symbols';
    }
    return errorsToText(formControl?.errors);
  }

 function errorsToText(errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    let message = '';
    for (const prop in errors) {
      message += errors[prop] + ' ';
    }
    return message;
  }
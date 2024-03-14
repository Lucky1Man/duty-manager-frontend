import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Template } from '../../shared/template';

export function nameNotSameValidator(referenceTemplate: Template): ValidatorFn {
  return (control: AbstractControl<string>) => {
    if(control.value.trim() === referenceTemplate.name) {
        return {
            invalidTemplateName: 'Name is already applied.'
        }
    }
    else {
        return null;
    }
  };
}

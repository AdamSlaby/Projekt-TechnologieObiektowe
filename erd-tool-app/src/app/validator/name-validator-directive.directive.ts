import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {NameValidator} from './name-validator';

@Directive({
  selector: '[appForbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: NameValidatorDirectiveDirective, multi: true}]
})
export class NameValidatorDirectiveDirective implements Validator {
  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value === null) {
      return null;
    }
    return NameValidator.isNameReserved(control.value) ? {reservedWord: true} : null;
  }

}

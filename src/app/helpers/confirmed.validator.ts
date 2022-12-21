import { AbstractControl, FormGroup } from '@angular/forms';

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (controls: AbstractControl) => {
        const control = controls.get(controlName);
        const matchingControl = controls.get(matchingControlName);

        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            return matchingControl.setErrors({ confirmedValidator: true });
        } else {
            return matchingControl.setErrors(null);
        }
    }
}
import { AbstractControl, ValidationErrors, ValidatorFn, NG_VALIDATORS, Validator } from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[checkParamValueIsGreaterthan]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ParamValueIsGreaterthanDirective,
        multi: true
    }]
})
export class ParamValueIsGreaterthanDirective {

    @Input() checkParamValueIsGreaterthan: string;
    validate(control: AbstractControl): ValidationErrors | null {
        var paramValue = Number(this.checkParamValueIsGreaterthan);
        var inputValue = Number(control.value);
        console.log(paramValue+'-----'+inputValue)
        if (inputValue !== undefined && paramValue !== undefined && (isNaN(inputValue) && isNaN(paramValue) || inputValue > paramValue)) {
            return { 'isGreaterthan': true };
        }
        return null;
        // return this.customValidators < control.value ? {'BalanceLow':true} : null;
    }
}

@Directive({
    selector: '[PhoneNumberValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PhoneNumberValidatorDirective,
        multi: true
    }]
})
export class PhoneNumberValidatorDirective {
    @Input() PhoneNumberValidator?: boolean | string;

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.PhoneNumberValidator == 'false') {
            return null;
        }
        if (control.value) {
            if (control.value.length > 11 || control.value.length < 11) {
                return { 'phoneNOMinMaxlength': true }
            }
            var prefix = control.value.substring(0, 3);
            console.log(prefix);
            if (control.value) {
                if (prefix != '013' && prefix != '014' && prefix != '015' && prefix != '016' && prefix != '017' && prefix != '018' && prefix != '019') {
                    console.log('true')
                    return { 'phoneNumberInvalid': true };
                }
                return null;
                // return this.customValidators < control.value ? {'BalanceLow':true} : null;
            }
        }
        return null;
    }
}

//regular expression "^(?:+88|88)?(01[3-9]\d{8})$"
// const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
//       const valid = regex.test(control.value);
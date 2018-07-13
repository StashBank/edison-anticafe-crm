import { FormGroup } from "@angular/forms";

export class RegistrationValidator {

  static validate(createUserForm: FormGroup) {

    let password = createUserForm.get('password').value;
    let repeatPassword = createUserForm.get('repeatPassword').value;

    if (repeatPassword.length <= 0) {
      return null;
    }
    if (repeatPassword !== password) {
      return { MatchPassword: true }
    }
    return null;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  get submitButtonDisabled(): boolean {
    return this.form && this.form.invalid;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.spinner.show();
    this.userService.login(this.form.getRawValue())
      .finally(
        () => this.spinner.hide()
      )
      .subscribe(
        () => this.router.navigate(['']),
        err => alert('Не коректний логин/пароль')
      );
  }

}

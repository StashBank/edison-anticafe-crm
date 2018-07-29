import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RegistrationValidator } from './registration-validator';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;
  public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-' , /\d/, /\d/];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      login: ['', [
          Validators.required,
          Validators.pattern(/^([A-z][A-Za-z]*\s+[A-Za-z]*\d{0,})|([A-z][A-Za-z]*\d{0,})$/),
        ]
      ],
      password: ['', [
          Validators.required,
        ]
      ],
      repeatPassword: ['', [
          Validators.required,
        ]
      ],
      email: ['', [
          // Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ]
      ],
      phone: ['', [
          // Validators.required
        ]
      ]
    },
     {
      validator: RegistrationValidator.validate
    });
  }

  public registerNewUser() {

    const data = this.createUserForm.value;
    this.spinner.show();
    this.userService.create(data)
      .finally(() => this.spinner.hide())
      .subscribe(response => {
        // console.log('okay');
        if (response.success) {
          this.snackBar.open('Користувача створенно', null, {duration: 800 });
          this.createUserForm.reset();
        } else {
          this.errorOnRegisterNewUser();
        }
      }, error => {
        console.log(error);
        this.errorOnRegisterNewUser();
      });
  }

  errorOnRegisterNewUser() {
    this.snackBar.open('Помилка під час створення користувача', null, { duration: 800 });
  }

}

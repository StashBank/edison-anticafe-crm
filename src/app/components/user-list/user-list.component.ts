import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // #region Fields
  userList: Array<User>;
  user: User;
  isNew: boolean;
  userSelected: boolean;
  form: FormGroup;
  phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  // #endregion

  constructor(
    private location: Location,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.createForm();
  }

  // #region Methods
  loadUsers() {
    this.userService.getList().subscribe(
      users => this.userList = users
    );
  }
  createForm() {
    this.form = this.formBuilder.group({
      login: [{value: null, disabled: true }],
      name: ['', [Validators.required]],
      email: ['', [/*Validators.required*/, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      phone: ['', [/*Validators.required*/]],
      isAdmin: false
    });
  }
  onError(error) {
    console.error(error);
  }
  // #endregion

  // #region View Methods
  getListItemClass(row: User) {
    const userId = this.user && this.user.id;
    const rowId = row && row.id;
    if (userId && userId === rowId) {
      return 'selected';
    }
  }

  selectUser(row: User) {
    this.user = row;
    this.form.patchValue(row);
    this.form.markAsUntouched();
    this.isNew = false;
    this.userSelected = true;
  }
  // #endregion

  // #region CRUD Methods
  getSaveQuery(user: User) {
    return this.userService.modify(this.user.id, user);
  }

  save() {
    const data = this.form.value;
    this.spinner.show();
    this.getSaveQuery(data)
      .finally(() => this.spinner.hide())
      .subscribe((res: any) => {
        if (res.success) {
          this.snackBar.open('Дані збережено', null, { duration: 800 });
          this.onSaved(new User(res.data));
        } else {
          this.snackBar.open('Помилка збереження даних', null, { duration: 800 });
          this.onError(res);
        }
        this.form.markAsUntouched();
      }, this.onError);
  }

  onSaved(user: User) {
    this.selectUser(user);
  }

  delete() {
    if (confirm('Ви дійсно бажаете видалити запис?')) {
      this.userService.remove(this.user.id)
        .subscribe((res) => {
          if (res.success) {
            this.user = null;
            this.loadUsers();
          } else {
            this.onError(res);
          }
        }, this.onError);
    }
  }

  cancel() {
    this.location.back();
  }
  // #endregion

}

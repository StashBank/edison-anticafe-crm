import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Expense, ExpenseType } from '../../models/expense.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { LookupsService } from '../../services/lookups.service';
import { Lookup } from '../../models/base.types';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExpenseCardComponent implements OnInit {

  caption: string;
  expense: Expense;
  form: FormGroup;
  expensetypeList: any[];
  isNew = true;
  lookupTypes = { ExpenseType };

  get saveButtonEnabled(): boolean {
    return this.form.touched && this.form.valid;
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private expenseService: ExpenseService,
    private lookupsService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.expense = new Expense();
    this.initFormControls();
    this.initLookups();
    this.getRouterParams();
  }

  initFormControls() {
    this.form = new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      amount: new FormControl(0, Validators.required),
      type: new FormControl()
    });
  }

  getRouterParams() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getExpense(id);
      } else {
        this.spinner.hide();
      }
    });
  }

  initLookups() {
    const lookups = ['ExpenseType'];
    lookups.forEach(lookupName => {
      this.lookupsService.getLookupData(lookupName)
        .subscribe(res => {
          if (res.success) {
            const listName = lookupName.toLowerCase() + 'List';
            const LookupType = this.lookupTypes[lookupName] || Lookup;
            this[listName] = res.data.map(i => new LookupType(i));
          }
        });
    });
  }

  getExpense(id: string) {
    this.expenseService.getExpense(id)
      .finally(() => this.spinner.hide())
      .subscribe((res) => {
        if (res.success && res.data) {
          this.expense = new Expense(res.data);
          this.setControlValues();
          this.isNew = false;
        }
      });
  }

  setControlValues() {
    for (const columnName of Object.keys(this.expense)) {
      const control = this.form.controls[columnName];
      const value = this.expense[columnName];
      if (control) {
        control.setValue(this.getConrtolValue(columnName, value));
      }
    }
  }

  getConrtolValue(controlName: string, value: any) {
    return value && value.value ? value.value : value;
  }

  cancel() {
    this.location.back();
  }

  save() {
    let expense = <any>this.expense || {};
    expense = Object.assign(expense, this.form.value);
    this.spinner.show();
    this.getSaveQuery(expense)
      .finally(() => this.spinner.hide())
      .subscribe(res => this.onSaved(res));
  }

  getSaveQuery(order: any): Observable<any> {
    return this.isNew ?
      this.expenseService.add(order) :
      this.expenseService.update(this.expense.id, order);
  }

  onSaved(res: any) {
    if (res.success) {
      this.isNew = false;
      this.snackBar.open('Дані збережено', null, { duration: 800 });
    } else {
      this.snackBar.open('Помилка при збережені', null, { duration: 800 });
      console.error(res);
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === '13' && this.saveButtonEnabled) {
      this.save();
    }
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Income, IncomeType } from '../../models/income.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IncomeService } from '../../services/income.service';
import { MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { LookupsService } from '../../services/lookups.service';
import { Lookup } from '../../models/base.types';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-income-card',
  templateUrl: './income-card.component.html',
  styleUrls: ['./income-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeCardComponent implements OnInit {

  caption: string;
  income: Income;
  form: FormGroup;
  incometypeList: any[];
  isNew = true;
  lookupTypes = { IncomeType };

  get saveButtonEnabled(): boolean {
    return this.form.touched && this.form.valid;
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private incomeService: IncomeService,
    private lookupsService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.income = new Income();
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
        this.getIncome(id);
      } else {
        this.spinner.hide();
      }
    });
  }

  initLookups() {
    const lookups = ['IncomeType'];
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

  getIncome(id: string) {
    this.incomeService.getIncome(id)
      .finally(() => this.spinner.hide())
      .subscribe((res) => {
        if (res.success && res.data) {
          this.income = new Income(res.data);
          this.setControlValues();
          this.isNew = false;
        }
      });
  }

  setControlValues() {
    for (const columnName of Object.keys(this.income)) {
      const control = this.form.controls[columnName];
      const value = this.income[columnName];
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
    let income = <any>this.income || {};
    income = Object.assign(income, this.form.value);
    this.spinner.show();
    this.getSaveQuery(income)
      .finally(() => this.spinner.hide())
      .subscribe(res => this.onSaved(res));
  }

  getSaveQuery(order: any): Observable<any> {
    return this.isNew ?
      this.incomeService.add(order) :
      this.incomeService.update(this.income.id, order);
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

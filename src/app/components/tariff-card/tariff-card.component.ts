import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tariff, TariffType } from './../../models/tariff.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LookupsService } from '../../services/lookups.service';
import { UUID, Lookup } from '../../models/base.types';
import { MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-tariff-card',
  templateUrl: './tariff-card.component.html',
  styleUrls: ['./tariff-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TariffCardComponent implements OnInit {

  lookupName = 'Tariff';
  tariffList: Tariff[];
  parentList: Tariff[];
  tarifftypeList: TariffType[];
  tariff = new Tariff();
  isNew = true;
  itemSelected = false;
  form: FormGroup;

  get tariffType(): TariffType {
    if (!Array.isArray(this.tarifftypeList)) {
      return null;
    }
    const tariffTypeId = this.form.get('type').value;
    const type = this.tarifftypeList.find(i => i.value === tariffTypeId);
    return type;
  }

  get tariffTypeCode(): string {
    return this.tariffType && this.tariffType.code || '';
  }

  get positionFieldVisible(): boolean {
    return this.tariffTypeCode === 'hour';
  }
  get parentFieldVisible(): boolean {
    return this.tariffTypeCode === 'hour';
  }

  constructor(
    private location: Location,
    private lookupsService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.initFormControls();
    this.getLookupData();
    this.initLookups();
  }

  initLookups() {
    const lookups = ['TariffType'];
    lookups.forEach(lookupNae => {
      this.lookupsService.getLookupData(lookupNae)
        .subscribe(res => {
          if (res.success) {
            const listName = lookupNae.toLowerCase() + 'List';
            this[listName] = res.data.map(i => new Lookup(i));
          }
        });
    });
  }

  initFormControls() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      cost: new FormControl(0, Validators.required),
      position: new FormControl(),
      parent: new FormControl()
    });
  }

  cancel() {
    this.location.back();
  }

  onError(error) {
    console.error(error);
  }

  getLookupData() {
    this.lookupsService.getLookupData(this.lookupName)
    .finally(() => this.spinner.hide())
    .subscribe((res: any) => {
      if (res.success) {
        this.tariffList = res.data.map(t => new Tariff(t));
        this.isNew = true;
        this.tariff = new Tariff();
        this.updateParentList();
      } else {
        this.onError(res.error);
      }
    });
  }

  selectTariff(item: Tariff, skeepFormValues = false) {
    this.tariff = item;
    if (skeepFormValues) {
      return;
    }
    const values = {
      name: this.tariff.displayValue || ''
    };
    for (const controlName in this.tariff) {
      if (this.form.contains(controlName)) {
        const value = this.tariff[controlName];
        values[controlName] = value && value.value ? value.value : value || null;
      }
    }
    this.form.setValue(values);
    this.form.markAsUntouched();
    this.isNew = false;
    this.itemSelected = true;
    this.updateParentList();
  }

  updateParentList() {
    this.parentList = this.tariffList.filter(t => t.value !== this.tariff.value);
  }

  getListItemClass(item: Tariff) {
    const tariffId = this.tariff && this.tariff.value;
    const itemId = item && item.value;
    if (tariffId && tariffId === itemId) {
      return 'selected';
    }
  }

  getSaveQuery(data: any) {
    return this.isNew ?
      this.lookupsService.addLookupItem(this.lookupName, data) :
      this.lookupsService.setLookupItem(this.lookupName, this.tariff.value, data);
  }

  save() {
    const data = this.form.value;
    this.getSaveQuery(data)
      .finally(() => this.spinner.hide())
      .subscribe((res) => {
        if (res.success) {
          this.snackBar.open('Дані збережено', null, { duration: 800 });
          this.onSaved(res.data);
        } else {
          this.snackBar.open('Помилка збереження даних', null, { duration: 800 });
          this.onError(res);
        }
        this.form.markAsUntouched();
      }, this.onError);
  }

  onSaved(data: any) {
    data.type = this.tarifftypeList.find(i => i.value === data.typeId);
    data.parent = this.tariffList.find(i => i.value === data.parentId)
    const tariff = new Tariff(data);
    if (this.isNew) {
      this.tariffList.unshift(tariff);
      this.selectTariff(tariff);
    }
    // this.tariff = tariff;
  }

  create() {
    this.tariff = new Tariff();
    this.selectTariff(this.tariff);
    this.isNew = true;
  }

  delete() {
    if (confirm('Ви дійсно бажаете видалити запис?')) {
      this.lookupsService.deleteLookupItem(this.lookupName, this.tariff.value)
        .subscribe((res) => {
          if (res.success) {
            this.tariff = new Tariff();
            this.selectTariff(this.tariff);
            this.getLookupData();
          } else {
            this.onError(res);
          }
        }, this.onError);
    }
  }

}

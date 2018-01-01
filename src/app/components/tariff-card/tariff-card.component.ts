import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tariff } from './../../models/tariff.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LookupsService } from '../../services/lookups.service';
import { UUID, Lookup } from '../../models/base.types';

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
  tariff = new Tariff();
  isNew = true;
  itemSelected = false;
  form: FormGroup;

  constructor(
    private location: Location,
    private lookupsService: LookupsService) { }

  ngOnInit() {
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
    this.lookupsService.getLookupData(this.lookupName).subscribe((res: any) => {
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
      .subscribe((res) => {
        if (res.success) {
          alert('Дані збережено');
          this.onSaved(res.data);
        } else {
          alert('Помилка збереження даних');
          this.onError(res);
        }
      }, this.onError);
  }

  onSaved(data: any) {
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

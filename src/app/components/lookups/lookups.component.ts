import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { LookupsService } from '../../services/lookups.service';
import { MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LookupsComponent implements OnInit {

  lookups: any[];
  lookup: any;
  lookupData: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private lookupService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.getLookup()
      .then(this.getRouterParams.bind(this))
      .catch(this.onError.bind(this));
  }

  onChanges(item) {
    item.changed = true;
  }

  onError(error) {
    console.error(error);
  }

  getLookup(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.lookupService.get().subscribe((res: any) => {
        if (res) {
          this.lookups = res;
          resolve();
        } else {
          reject('Lookups is empty');
        }
      });
    });
  }

  getRouterParams(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.route.params.subscribe((params: any) => {
        const lookupName = params['lookupName'];
        this.lookup = this.lookups && this.lookups.find(i => i.name === lookupName);
        this.getLookupData();
      });
    });
  }

  getLookupData() {
    const lookupName = this.lookup && this.lookup.name;
    if (lookupName) {
      this.lookupService.getLookupData(lookupName)
      .finally(() => this.spinner.hide())
      .subscribe((res: any) => {
        if (res.success) {
          this.lookupData = res.data;
        } else {
          this.onError(res.error);
        }
      });
    } else {
      this.onError('lookup not found');
    }
  }

  appendItem() {
    this.lookupData.push({ changed: true, isNew: true});
  }

  saveItem(item: any) {
    this.spinner.show();
    if (item.isNew) {
      this.insertItem(item);
    } else {
      this.updateItem(item);
    }
  }

  insertItem(item: any) {
    if (this.lookup) {
      this.lookupService.addLookupItem(this.lookup.name, item)
        .finally(() => this.spinner.hide())
        .subscribe(res => {
          if (res.success) {
            this.getLookupData();
          }
        });
    }
  }

  updateItem(item: any) {
    if (this.lookup) {
      this.lookupService.setLookupItem(this.lookup.name, item.id, item)
        .finally(() => this.spinner.hide())
        .subscribe(res => {
          if (res.success) {
            this.getLookupData();
          }
        });
    }
  }

  deleteItem(item: any) {
    if (this.lookup) {
      this.spinner.show();
      this.lookupService.deleteLookupItem(this.lookup.name, item.id)
      .finally(() => this.spinner.hide())
      .subscribe(res => {
        if (res.success) {
          this.getLookupData();
        }
      });
    }
  }

  cancel() {
    this.location.back();
  }

}

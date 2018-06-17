import { Income } from './../../models/income.model';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatSort
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeListComponent implements OnInit {

  displayedColumns = [];
  dataSource = new MatTableDataSource<Income>();
  columnsConfig: { caption: string, path: string }[];
  selectedItem: Income;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private incomeService: IncomeService,
    private router: Router) { }

  ngOnInit() {
    this.intiColumnsConfig();
    this.displayedColumns = this.columnsConfig.map(i => i.path)
      .concat(['order']);
    this.getIncomes();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearFileter(filter) {
    filter.value = '';
    this.applyFilter('');
  }

  intiColumnsConfig() {
    this.columnsConfig = [
      { caption: 'Тип', path: 'type' },
      { caption: 'Дата', path: 'date' },
      { caption: 'Сума', path: 'amount' },
    ];
  }

  getIncomes() {
    this.incomeService.getIncomes()
      .subscribe((res: { success: boolean, data: any[] }) => {
        if (res.success && res.data) {
          this.selectedItem = null;
          const incomes = res.data.map(i => new Income(i));
          this.dataSource = new MatTableDataSource<Income>(incomes);
          this.dataSource.sort = this.sort;
        }
      });
  }

  onRowClick(row: any) {
    this.selectedItem = row;
  }

  onRowDblClick(row: any) {
    if (row.id) {
      this.router.navigate(['/income', row.id]);
    }
  }

  getRowClass(row: Income) {
    if (this.selectedItem && row && this.selectedItem === row) {
      return 'selected';
    }
  }

  getDisplayValue(value: any): string {
    if (!value) {
      return value;
    }
    if (value.constructor === Date) {
      const day = this.getDatePartValue(value.getDate());
      const month = this.getDatePartValue(value.getMonth() + 1);
      const year = value.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return value.toString();
  }

  getDatePartValue(value: Number): string {
    if (value === 0) {
      return '00';
    }
    if (!value) {
      return '';
    }
    return value > 9 ? value.toString() : '0' + value;
  }

  createIncome() {
    this.router.navigate(['income']);
  }

}

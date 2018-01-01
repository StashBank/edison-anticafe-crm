import { Router } from '@angular/router';
import { Order } from './../../models/order.model';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatDialog,
  MatSort
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {

  displayedColumns = [];
  dataSource = new MatTableDataSource<Order>();
  columnsConfig: [{ caption: string, path: string }];
  selectedItem: Order;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrderService,
    private router: Router) { }

  ngOnInit() {
    this.intiColumnsConfig();
    this.displayedColumns = this.columnsConfig.map(i => i.path);
    this.getOrders();
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
      { caption: 'Номер', path: 'number' },
      { caption: 'Кліент', path: 'client' },
      { caption: 'Продукт', path: 'product' },
      { caption: 'Дата початку', path: 'startDate' },
      { caption: 'Дата закінчення', path: 'endDate' },
      { caption: 'Статус', path: 'status' },
      { caption: 'Вартість', path: 'cost' }
    ];
  }

  getOrders() {
    this.orderService.getOrders()
      .subscribe((res: { success: boolean, data: any[] }) => {
        if (res.success && res.data) {
          this.selectedItem = null;
          const orders = res.data.map(i => new Order(i));
          this.dataSource = new MatTableDataSource<Order>(orders);
          this.dataSource.sort = this.sort;
        }
      });
  }

  onRowClick(row: any) {
    this.selectedItem = row;
  }

  onRowDblClick(row: any) {
    if (row.id) {
      this.router.navigate(['/order', row.id]);
    }
  }

  getRowClass(row: Order) {
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
      const hours = this.getDatePartValue(value.getHours());
      const minutes = this.getDatePartValue(value.getMinutes());
      const seconds = this.getDatePartValue(value.getSeconds());
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
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

}

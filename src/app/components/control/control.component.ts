import { 
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  @Input() model: any;
  @Input() bindTo: string;
  @Input() isEditable: boolean = true;
  @Input() caption: string;
  @Output() valueChanged: EventEmitter<{value:any, bindTo: string}> = 
  new EventEmitter<{ value: any, bindTo: string }>();

  get value() {
    const value = this.model && this.model[this.bindTo];
    return this.getDateValue(value) || value;
  }

  set value(value: any) {
    if (this.model) {
      this.model[this.bindTo] = value;
      this.valueChanged.emit({ value: value, bindTo: this.bindTo });
    }
  }

  get dataValueType() : string {
    const value = this.model && this.model[this.bindTo];
    if (value && value.constructor === Date) {
      return "date";
    }

    if (value && value.constructor === Number) {
      return "number";
    }

    if (value && value.constructor === String) {
      return "text";
    }

    if (value && value.constructor === Boolean) {
      return "bolean";
    }

    return "text";
  }
  
  getDateValue(value: any) {
    if (value && value.constructor === Date) {
      return `${value.getDate()}.${value.getMonth() + 1}.${value.getFullYear()}`
    }
    return null;
  }

  get dateStringValue(): string {
    const value = this.value;
    if (value && value.constructor === Date) {
      return value.toISOString().substr(0, 10);
    }
  }

  constructor() { }

  ngOnInit() {
  }

}

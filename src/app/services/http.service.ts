import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
@Injectable()
export class AppHttp extends Http {

  public request(url, opts) {
    const request = super.request(url, opts);
    return request.catch(err => {
      if (err.status === 302) {
        window.location.reload();
        return null;
      }
      return Observable.throw(err);
    });
  }
}

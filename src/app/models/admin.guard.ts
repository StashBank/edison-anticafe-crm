import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "./user.model";


export class AdminGuard implements CanActivate {
  constructor(private account: User, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let isAdmin = this.account.isAdmin;
    if (isAdmin === true) {
      alert("Ви адміністратор");
    }
      return isAdmin;
  }
}

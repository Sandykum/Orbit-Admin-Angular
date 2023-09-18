import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){

  }
  canActivate(){
    if(this.auth.IsloggedIn()){
      return true;
    }
    alert("Please Login !!!")
    this.router.navigateByUrl('Bloom/admin/login');
    return false;
  }
  
}

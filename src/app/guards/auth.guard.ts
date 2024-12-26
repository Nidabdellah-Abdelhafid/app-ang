import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './../services/account.service';
import { JwtTokenService } from './../services/jwt-token.service';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private jwtTokenService:JwtTokenService,
    private accountService:AccountService,
    private router:Router
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
    if(!this.jwtTokenService.loggedIn()){
      
      this.jwtTokenService.remove();
      this.accountService.changeStatus(false);
      this.router.navigateByUrl("/login");

      return false;
    }
    
      return true;
  }
  
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AfterAuthGuard implements CanActivate {
 constructor(
     private jwtTokenService:JwtTokenService,
     private router:Router
   ){
 
   }
 
   canActivate(
     route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot): boolean {
       
     if(this.jwtTokenService.loggedIn()){
       
       this.router.navigateByUrl("/");
 
       return false;
     }
     
       return true;
   }
}

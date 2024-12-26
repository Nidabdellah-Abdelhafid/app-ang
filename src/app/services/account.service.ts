import { JwtTokenService } from './jwt-token.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loggedIn = new BehaviorSubject<boolean>(this.jwtTokenService.loggedIn());

  authStatus = this.loggedIn.asObservable();

  constructor(private jwtTokenService:JwtTokenService) { }

  changeStatus(value:boolean){
    this.loggedIn.next(value);
  }
}

import { AuthService } from './../../../services/auth.service';
import { JwtTokenService } from './../../../services/jwt-token.service';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  currentUser:null | undefined;
  authUser:any;

  constructor(
    private accountService:AccountService,
    private authService:AuthService,
    private jwtTokenService:JwtTokenService,
    private router:Router
  ){

  }

  ngOnInit(): void {

    this.accountService.authStatus.subscribe(res=>{
      this.currentUser= this.jwtTokenService.getInfos();
    })
    
  }

  logOut(){
    this.authService.logOutTkn().subscribe(res=> {return;});
    this.jwtTokenService.remove();
    this.accountService.changeStatus(false);
    this.router.navigateByUrl("/login");
  }


}

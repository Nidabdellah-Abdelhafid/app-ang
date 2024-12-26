import { AccountService } from './../../services/account.service';
import { JwtTokenService } from './../../services/jwt-token.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      
    }
  )

  constructor(
    private authService: AuthService,
     private jwtTokenService:JwtTokenService ,
     private router:Router,
    private accountService:AccountService){

  }


  ngOnInit(): void {
    
  }

  login() {
    const formValue = this.loginForm.value as { email: string, password: string };
    this.authService.login(formValue).subscribe(res => this.handleResponse(res));
    
  }
  
  handleResponse(res:any){
    this.jwtTokenService.handle(res);
    this.accountService.changeStatus(true);
    this.router.navigateByUrl("/users");
  }


}

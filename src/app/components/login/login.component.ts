import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { JwtTokenService } from './../../services/jwt-token.service';
import { AccountService } from './../../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ])
  });

  errorMessage: string = '';  // Declare the errorMessage variable

  constructor(
    private authService: AuthService,
    private jwtTokenService: JwtTokenService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
   }

  login() {
    const formValue = this.loginForm.value as { email: string, password: string };
    this.authService.login(formValue).subscribe(
      res => this.handleResponse(res),
      err => this.handleError(err)  // Handle the error if any occurs
    );
  }

  handleResponse(res: any) {
    if (res.status === 403) {
      this.errorMessage = 'Access Denied. Invalid credentials!';
      return;
    }
    this.jwtTokenService.handle(res);
    this.accountService.changeStatus(true);
    this.router.navigateByUrl("/users");
  }

  handleError(err: any) {
    if (err.status === 403) {
      this.errorMessage = 'Access Denied. Invalid credentials!';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }
}
